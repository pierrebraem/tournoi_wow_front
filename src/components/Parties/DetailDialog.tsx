import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Character } from '../../types/characters';
import { Party, PDetailDialog } from '../../types/parties';

function DetailDialog({ id, visible, sendDataToParent }: Readonly<PDetailDialog>){
    const [dataCharacters, setDataCharacters] = useState<Character[]>([]);
    const [dataGroupe, setDataGroupe] = useState<Party | null>(null);

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
        <Dialog header={"Détail du groupe " + dataGroupe?.party_name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
            <p>Id : {dataGroupe?.id}</p>
            <p>Nom : {dataGroupe?.party_name}</p>
                
            <p>Liste des personnages :</p>
            {dataCharacters.map(character => (
                <ul key={character.id}>
                    <li>Id : {character.id}</li>
                    <li>Nom : {character.name}</li>
                    <li>Classe : {character.class.label}</li>
                    <li>Rôle : {character.role.label}</li>
                </ul>
            ))}
        </Dialog>
    )
}

export default DetailDialog;