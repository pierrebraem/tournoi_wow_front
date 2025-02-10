import { useState } from 'react';
import { Dialog } from 'primereact/dialog';

function DetailDialog({ id, visible, sendDataToParent }){
    const [data, setData] = useState({});

    function closeModal(){
        sendDataToParent();
    }

    function getData(){
        fetch("http://localhost:3000/characters/" + id)
        .then(response => response.json())
        .then(data => setData(data[0]));
    }

    return(
        <>
            <Dialog header={"Détail du personnage " + data.name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <p>Nom : {data.name}</p>
                    <p>Classe : {data.class}</p>
                    <p>Rôle : {data.role}</p>
                    <p>ilvl : {data.ilvl}</p>
                    <p>rio : {data.rio}</p>
                </div>
            </Dialog>
        </>
    )
}

export default DetailDialog