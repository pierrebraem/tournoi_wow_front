import { useState, useEffect } from "react";
import PartyDialog from "./Dialog";
import DetailDialog from "./DetailDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { showConfirmDelete } from "../Communs/DeleteDialog";
import { Character, Party } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

function Parties(){
    const [parties, setParties] = useState<Party[]>([]);
    const [charactersOption, setCharactersOption] = useState<Character[]>([]);
    const [globalId, setGlobalId] = useState<number | null>(null);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

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
                await fetch(`${expressUrl}/parties/` + id, {
                    method: "delete"
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
                const [partiesResponse, charactersResponse] = await Promise.all([
                    fetch(`${expressUrl}/parties`),
                    fetch(`${expressUrl}/characters`)
                ]);

                const [parties, characters] = await Promise.all([
                    partiesResponse.json(),
                    charactersResponse.json()
                ]);

                if(!ignore){
                    setParties(parties);
                    setCharactersOption(characters);
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
            <DataTable value={parties} className="pb-4">
                <Column field="name" header="Nom" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>  

            <Button label="Ajouter un groupe" onClick={() => visibleDialogIcon(null, 'add')} />
            <PartyDialog visible={visibleDialog} sendDataToParent={dataFromDialog} charactersOption={charactersOption} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={dataFromDialog} id={globalId} />
        </>
    );
}

export default Parties;