import { useState } from 'react';
import { Dialog } from 'primereact/dialog';

function DetailDialog({ id, visible, sendDataToParent }){
    const [dataCharacters, setDataCharacters] = useState([]);
    const [dataGroupe, setDataGroupe] = useState({});

    function closeModal(){
        sendDataToParent(false);
    }

    function getData(){
        fetch("http://localhost:3000/compose/" + id)
        .then(response => response.json())
        .then(data => setDataCharacters(data));

        fetch("http://localhost:3000/parties/" + id)
        .then(response => response.json())
        .then(data => setDataGroupe(data[0]));
    }

    return(
        <>
            <Dialog header={"Détail du groupe " + dataGroupe.party_name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <p>Id : {dataGroupe.id}</p>
                <p>Nom : {dataGroupe.party_name}</p>
                
                <p>Liste des personnages :</p>
                {dataCharacters.map(character => (
                    <ul key={character.id}>
                        <li>Id : {character.id}</li>
                        <li>Nom : {character.name}</li>
                        <li>Classe : {character.classe}</li>
                        <li>Rôle : {character.role}</li>
                    </ul>
                ))}
            </Dialog>
        </>
    )
}

export default DetailDialog;