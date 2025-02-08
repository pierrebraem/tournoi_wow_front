import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Characters(){
    const [characters, setCharacters] = useState([]);

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
        </>
    )
}

export default Characters