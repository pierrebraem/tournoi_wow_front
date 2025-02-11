import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import AddDialog from "./AddDialog";

function Tournaments(){
    const [visibleAdd, setVisibleAdd] = useState(false);
    const [dungeonsOption, setDungeonsOption] = useState([]);
    const [partiesOption, setPartiesOption] = useState([]);

    function loadData(){
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

    useEffect(() => {
        loadData();
    }, [])
    return(
        <>
            <AddDialog visible={visibleAdd} sendDataToParent={dataFromDialog} dungeonsOption={dungeonsOption} partiesOption={partiesOption} />
            <Button label="Ajouter un tournoi" onClick={() => setVisibleAdd(true)} />
        </>
    )
}

export default Tournaments;