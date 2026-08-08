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

    async function loadData(){
        try{
            const partiesResponse = await fetch(`${expressUrl}/parties`)
            const parties = await partiesResponse.json()
            setParties(parties)

            const charactersResponse = await fetch(`${expressUrl}/characters`)
            const characters = await charactersResponse.json()
            setCharactersOption(characters)
        }
        catch(error){
            console.error(error)
        }
    }

    function dataFromDialog(){
        loadData();
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

                loadData();
            }
        });
    }

    function visibleDetailIcon(id: number){
        setGlobalId(id);
        setVisibleDetail(true);
    }

    function visibleDialogIcon(id: number | null, type: 'edit' | 'add'){
        if (type == 'edit') setGlobalId(id)
        setVisibleDialog(true)
    }

    function bodyIcons(rowData: Party){
        return(
            <div className="spacing-between-buttons">
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id)} name="Detail"/>
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleDialogIcon(rowData.id, 'edit')} name="Edit"/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.name)} name="Delete" />
            </div>
        )
    }

    useEffect(() => {
        loadData();
    }, []);

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
    )
}

export default Parties;