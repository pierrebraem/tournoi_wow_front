import { useEffect, useState, useRef } from "react";
import CharacterDialog from "./Dialog";
import DetailDialog from "./DetailDialog";
import Error from "../Error/Error";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { showConfirmDelete } from "../Communs/DeleteDialog";
import { Character, Class, ErrorType } from "../../types";
import { getCharacters, deleteCharacter, getClasses } from "../../utils/api";

function Characters(){
    const [characters, setCharacters] = useState<Character[]>([]);
    const [classOption, setClassOption] = useState<Class[]>([]);
    const [globalId, setGlobalId] = useState<number | null>(null);
    const [apiError, setApiError] = useState<ErrorType | null>(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const toast = useRef<Toast>(null);

    function dataFromDialog(){
        setRefreshTrigger(prev => prev + 1);
        setVisibleDialog(false);
        setVisibleDetail(false);
        setGlobalId(null);
    }

    function confirmDelete(id: number | null, name: string){
        if (id == null) return;

        showConfirmDelete({
            message: "Etes-vous sûr de supprimer le personnage " + name + " ?",
            header: "Suppression du personnage " + name,
            accept: async () => {
                const res = await deleteCharacter(id);
                
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
                    summary: 'Personnage supprimé',
                    detail: `Le personnage ${name} a été supprimé avec succès`,
                    life: 5000,
                });

                setRefreshTrigger(prev => prev + 1);
            }
        });
    }

    function visibleDetailIcon(id: number | null){
        setGlobalId(id);
        setVisibleDetail(true);
    }

    function visibleDialogIcon(id: number | null, type: 'add' | 'edit'){
        if (type == 'edit') setGlobalId(id);
        setVisibleDialog(true);
    }

    function bodyIcons(rowData: Character){
        return(
            <div className="spacing-between-buttons">
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id ?? null)} name="Detail"/>
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleDialogIcon(rowData.id ?? null, 'edit')} name="Edit"/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id ?? null, rowData.name)} name="Delete"/>
            </div>
        );
    }

    useEffect(() => {
        let ignore = false;
        async function loadData(){
            try{
                const [resCharacters, resClasses] = await Promise.all([
                    getCharacters(),
                    getClasses(),
                ]);

                if(!ignore){
                    if(resCharacters.status != 200){
                        setVisibleError(true);
                        setApiError({
                            status: resCharacters.status,
                            message: resCharacters.message,
                        });
                        return;
                    }
                    setCharacters(resCharacters.data);

                    if(resClasses.status != 200){
                        setVisibleError(true);
                        setApiError({
                            status: resClasses.status,
                            message: resClasses.message
                        });
                        return;
                    }
                    setClassOption(resClasses.data);
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
            <Button label="Ajouter un personnage" onClick={() => visibleDialogIcon(null, 'add')} name="Add"/>
            <DataTable value={characters} className="pt-4">
                <Column field="name" header="Nom" />
                <Column field="class" header="Classe" />
                <Column field="role" header="Rôle" />
                <Column field="ilvl" header="ilvl" />
                <Column field="rio" header="rio" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>

            <CharacterDialog visible={visibleDialog} sendDataToParent={dataFromDialog} classOption={classOption} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={dataFromDialog} id={globalId} />
            <Error status={apiError?.status ?? null} message={apiError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)} /> 
            <Toast ref={toast} />
        </>
    );
}

export default Characters;