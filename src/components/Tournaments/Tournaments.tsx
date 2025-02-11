import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import AddDialog from "./AddDialog";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

function Tournaments(){
    const [tournaments, setTournaments] = useState([]);
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [dungeonsOption, setDungeonsOption] = useState([]);
    const [partiesOption, setPartiesOption] = useState([]);

    function loadData(){
        fetch("http://localhost:3000/tournaments")
        .then(response => response.json())
        .then(data => setTournaments(data));

        fetch("http://localhost:3000/dungeos")
        .then(response => response.json())
        .then(data => setDungeonsOption(data));

        fetch("http://localhost:3000/parties")
        .then(response => response.json())
        .then (data => setPartiesOption(data));
    }

    function dataFromDialog(){
        loadData();
        setVisibleAdd(false);
    }

    function bodyIcons(rowData){
        return(
            <>
                <Button icon="pi pi-book" />
                <Button icon="pi pi-pencil" severity="warning" />
                <Button icon="pi pi-trash" severity="danger" />
            </>
        )
    }

    useEffect(() => {
        loadData();
    }, [])
    return(
        <>
            <DataTable value={tournaments}>
                <Column field="name" header="Nom" />
                <Column field="start_date" header="Date de début" />
                <Column field="end_date" header="Date de fin" />
                <Column field="description" header="Description" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>

            <AddDialog visible={visibleAdd} sendDataToParent={dataFromDialog} dungeonsOption={dungeonsOption} partiesOption={partiesOption} />
            <Button label="Ajouter un tournoi" onClick={() => setVisibleAdd(true)} />
        </>
    )
}

export default Tournaments;