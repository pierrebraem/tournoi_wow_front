import { useEffect, useState } from "react";
import CharacterDialog from "./Dialog";
import DetailDialog from "./DetailDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { showConfirmDelete } from "../Communs/DeleteDialog";
import { Character } from "../../types/characters";
import { Class } from "../../types/classes";
import 'primeicons/primeicons.css';

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

function Characters(){
    const [characters, setCharacters] = useState<Character[]>([]);
    const [classOption, setClassOption] = useState<Class[]>([]);
    const [globalId, setGlobalId] = useState<number | null>(null);
    const [visibleDialog, setVisibleDialog] = useState<boolean>(false);
    const [visibleDetail, setVisibleDetail] = useState<boolean>(false);

    function loadData(){
        fetch(`${expressUrl}/characters`)
        .then(response => response.json())
        .then(data => setCharacters(data))

        fetch(`${expressUrl}/class`)
        .then(response => response.json())
        .then(data => setClassOption(data))
    }

    function dataFromDialog(){
        loadData();
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
                await fetch(`${expressUrl}/characters/` + id, {
                    method: "delete"
                });

                loadData();
            }
        });
    }

    function visibleDetailIcon(id: number | null){
        setGlobalId(id);
        setVisibleDetail(true);
    }

    function visibleDialogIcon(id: number | null, type: 'add' | 'edit'){
        if (type == 'edit') setGlobalId(id)
        setVisibleDialog(true)
    }

    function bodyIcons(rowData: Character){
        return(
            <div className="spacing-between-buttons">
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id ?? null)} name="Detail"/>
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleDialogIcon(rowData.id ?? null, 'edit')} name="Edit"/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id ?? null, rowData.name)} name="Delete"/>
            </div>
        )
    }

    useEffect(() => {
        loadData();
    }, []);

    return(
        <>
            <DataTable value={characters} className="pb-4">
                <Column field="name" header="Nom" />
                <Column field="class" header="Classe" />
                <Column field="role" header="Rôle" />
                <Column field="ilvl" header="ilvl" />
                <Column field="rio" header="rio" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>

            <Button label="Ajouter un personnage" onClick={() => visibleDialogIcon(null, 'add')} name="Add"/>
            <CharacterDialog visible={visibleDialog} sendDataToParent={dataFromDialog} classOption={classOption} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={dataFromDialog} id={globalId} />
        </>
    )
}

export default Characters