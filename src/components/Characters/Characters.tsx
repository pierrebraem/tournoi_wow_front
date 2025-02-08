import { useEffect, useState } from "react";
import AddDialog from "./AddDialog";
import DetailDialog from "./DetailDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import 'primeicons/primeicons.css';

function Characters(){
    const [characters, setCharacters] = useState([]);
    const [globalId, setGlobalId] = useState(0);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleDetail, setVisibleDetail] = useState(false);

    function loadData(){
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharacters(data))
    }

    function dataFromAddDialog(visible){
        loadData();
        setVisibleAdd(visible);
    }

    function closeDetailModal(visible){
        setVisibleDetail(visible)
    }

    function confirmDelete(id, name){
        confirmDialog({
            message: "Etes-vous sur de supprimer le personnage" + name,
            header: "Suppression",
            accept: async () => {
                await fetch("http://localhost:3000/characters/" + id, {
                    method: "delete"
                });

                loadData();
            }
        });
    }

    function bodyIcons(rowData){
        function visibleDetailIcon(id){
            setGlobalId(id);
            setVisibleDetail(true);
        }

        return(
            <>
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id)}/>
                <Button icon="pi pi-pencil" severity="warning" />
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.name)}/>
            </>
        )
    }

    useEffect(() => {
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharacters(data));
    }, []);

    return(
        <>
            <DataTable value={characters}>
                <Column field="name" header="Nom"></Column>
                <Column field="class" header="Classe"></Column>
                <Column field="role" header="Rôle"></Column>
                <Column field="ilvl" header="ilvl"></Column>
                <Column field="rio" header="rio"></Column>
                <Column header="Action" body={bodyIcons}></Column>
            </DataTable>

            <Button label="Ajouter un personnage" onClick={() => setVisibleAdd(true)}/>
            <AddDialog visible={visibleAdd} sendDataToParent={dataFromAddDialog} />
            <DetailDialog visible={visibleDetail} sendDataToParent={closeDetailModal} id={globalId} />
            <ConfirmDialog />
        </>
    )
}

export default Characters