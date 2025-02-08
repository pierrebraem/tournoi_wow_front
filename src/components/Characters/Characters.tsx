import { useEffect, useState } from "react";
import AddDialog from "./AddDialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

function Characters(){
    const [characters, setCharacters] = useState([]);
    const [visibleAdd, setVisibleAdd] = useState(false);

    function dataFromAddDialog(visible){
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharacters(data))

        setVisibleAdd(visible);
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
                <Column field="class_id" header="Classe"></Column>
                <Column field="role_id" header="Rôle"></Column>
                <Column field="ilvl" header="ilvl"></Column>
                <Column field="rio" header="rio"></Column>
            </DataTable>

            <Button label="Ajouter un personnage" onClick={() => setVisibleAdd(true)}/>
            <AddDialog visible={visibleAdd} sendDataToParent={dataFromAddDialog}/>
        </>
    )
}

export default Characters