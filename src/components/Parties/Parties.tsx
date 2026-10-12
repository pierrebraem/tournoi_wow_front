import { useState, useEffect, useRef } from "react";
import PartyDialog from "./Dialog";
import DetailDialog from "./DetailDialog";
import Error from "../Error/Error";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { showConfirmDelete } from "../Communs/DeleteDialog";
import { getCharacters, getParties, deleteParty } from "../../utils/api";
import { Character, ErrorType, Party } from "../../types";

function Parties(){
    const [parties, setParties] = useState<Party[]>([]);
    const [charactersOption, setCharactersOption] = useState<Character[]>([]);
    const [globalId, setGlobalId] = useState<number | null>(null);
    const [apiError, setApiError] = useState<ErrorType | null>(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const toast = useRef<Toast>(null);

    function dataFromDialog(){
        setRefreshTrigger(prev => prev + 1);
        setGlobalId(null);
        setVisibleDialog(false);
        setVisibleDetail(false);
    }

    function confirmDelete(id: number, name: string){
        showConfirmDelete({
            message: "Etes-vous sûr de supprimer le groupe " + name + " ?",
            header: "Suppression de l'équipe " + name,
            accept: async () => {
                const res = await deleteParty(id);

                if(res.status != 200){
                    setVisibleError(true);
                    setApiError({
                        status: res.status,
                        message: res.message,
                    });
                    return;
                }

                toast.current?.show({
                    severity: 'success',
                    summary: 'Groupe supprimé',
                    detail: `Le groupe ${name} a été supprimé avec succès`,
                    life: 5000,
                });

                setRefreshTrigger(prev => prev + 1);
            }
        });
    }

    function visibleDetailIcon(id: number){
        setGlobalId(id);
        setVisibleDetail(true);
    }

    function visibleDialogIcon(id: number | null, type: 'edit' | 'add'){
        if (type == 'edit') setGlobalId(id);
        setVisibleDialog(true);
    }

    function bodyIcons(rowData: Party){
        return(
            <div className="spacing-between-buttons">
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id)} name="Detail"/>
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleDialogIcon(rowData.id, 'edit')} name="Edit"/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.name)} name="Delete" />
            </div>
        );
    }

    useEffect(() => {
        let ignore = false;
        async function loadData(){
            try{
                const [resParties, resCharacters] = await Promise.all([
                    getParties(),
                    getCharacters(),
                ]);

                if(!ignore){
                    if(resParties.status != 200){
                        setVisibleError(true);
                        setApiError({
                            status: resParties.status,
                            message: resParties.message,
                        });
                        return;
                    }
                    setParties(resParties.data);

                    if(resCharacters.status != 200){
                        setVisibleError(true);
                        setApiError({
                            status: resCharacters.status,
                            message: resCharacters.message,
                        });
                        return;
                    }
                    setCharactersOption(resCharacters.data);
                }
            }
            catch(error){
                console.error(error);
            }
        }
        loadData();
        return () => { ignore = true; };
    }, [refreshTrigger]);

    return(
        <>
            <Button label="Ajouter un groupe" onClick={() => visibleDialogIcon(null, 'add')} />
            <DataTable value={parties} className="pt-4">
                <Column field="name" header="Nom" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>  

            <PartyDialog visible={visibleDialog} sendDataToParent={dataFromDialog} charactersOption={charactersOption} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={dataFromDialog} id={globalId} />
            <Error status={apiError?.status ?? null} message={apiError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)} />
            <Toast ref={toast} />
        </>
    );
}

export default Parties;