import { useEffect, useState } from "react";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import DetailDialog from "./DetailDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import 'primeicons/primeicons.css';

function Characters(){
    const [characters, setCharacters] = useState([]);
    const [classOption, setClassOption] = useState([]);
    const [globalId, setGlobalId] = useState(0);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleDetail, setVisibleDetail] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);

    function loadData(){
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharacters(data))

        fetch("http://localhost:3000/class")
        .then(response => response.json())
        .then(data => setClassOption(data))
    }

    function dataFromDialog(){
        loadData();
        setVisibleAdd(false);
        setVisibleDetail(false);
        setVisibleEdit(false);
    }

    function confirmDelete(id, name){
        confirmDialog({
            message: "Etes-vous sur de supprimer le personnage " + name,
            header: "Suppression",
            accept: async () => {
                await fetch("http://localhost:3000/characters/" + id, {
                    method: "delete"
                });

                loadData();
            }
        });
    }

    function visibleDetailIcon(id){
        setGlobalId(id);
        setVisibleDetail(true);
    }

    function visibleEditIcon(id){
        setGlobalId(id);
        setVisibleEdit(true);
    }

    function bodyIcons(rowData){
        return(
            <>
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id)} name="Detail"/>
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleEditIcon(rowData.id)} name="Edit"/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.name)} name="Delete"/>
            </>
        )
    }

    useEffect(() => {
        loadData();
    }, []);

    return(
        <>
            <DataTable value={characters}>
                <Column field="name" header="Nom" />
                <Column field="class" header="Classe" />
                <Column field="role" header="Rôle" />
                <Column field="ilvl" header="ilvl" />
                <Column field="rio" header="rio" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>

            <Button label="Ajouter un personnage" onClick={() => setVisibleAdd(true)} name="Add"/>
            <AddDialog visible={visibleAdd} sendDataToParent={dataFromDialog} classOption={classOption} />
            <EditDialog visible={visibleEdit} sendDataToParent={dataFromDialog} classOption={classOption} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={dataFromDialog} id={globalId} />
            <ConfirmDialog />
        </>
    )
}

export default Characters