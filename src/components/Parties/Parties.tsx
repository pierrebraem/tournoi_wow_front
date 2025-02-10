import { useState, useEffect } from "react";
import AddDialog from "./AddDialog";
import EditDialog from "./EditDialog";
import DetailDialog from "./DetailDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import 'primeicons/primeicons.css';

function Parties(){
    const [parties, setParties] = useState([]);
    const [globalId, setGlobalId] = useState(0);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDetail, setVisibleDetail] = useState(false);

    function loadData(){
        fetch("http://localhost:3000/parties")
        .then(response => response.json())
        .then(data => setParties(data));
    }

    function dataFromAddDialog(visible){
        loadData();
        setVisibleAdd(visible);
    }

    function dataFromEditDialog(visible){
        loadData();
        setVisibleEdit(visible);
    }

    function confirmDelete(id, name){
        confirmDialog({
            message: "Etes-vous sûr de supprimer le groupe " + name + " ?",
            header: "Suppression",
            accept: async () => {
                await fetch("http://localhost:3000/parties/" + id, {
                    method: "delete"
                });

                loadData();
            }
        })
    }

    function bodyIcons(rowData){
        function visibleDetailIcon(id){
            setGlobalId(id);
            setVisibleDetail(true);
        }

        function visibleEditIcon(id){
            setGlobalId(id);
            setVisibleEdit(true);
        }

        return(
            <>
                <Button icon="pi pi-book" onClick={() => visibleDetailIcon(rowData.id)} />
                <Button icon="pi pi-pencil" severity="warning" onClick={() => visibleEditIcon(rowData.id)}/>
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.party_name)} />
            </>
        )
    }

    function closeDetailModal(visible){
        setVisibleDetail(visible);
    }

    useEffect(() => {
        loadData();
    }, []);

    return(
        <>
            <DataTable value={parties}>
                <Column field="party_name" header="Nom" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>  

            <Button label="Ajouter un groupe" onClick={() => setVisibleAdd(true)} />
            <AddDialog visible={visibleAdd} sendDataToParent={dataFromAddDialog} />
            <EditDialog visible={visibleEdit} sendDataToParent={dataFromEditDialog} id={globalId} />
            <DetailDialog visible={visibleDetail} sendDataToParent={closeDetailModal} id={globalId} />
            <ConfirmDialog />
        </>
    )
}

export default Parties;