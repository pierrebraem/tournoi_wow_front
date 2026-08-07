import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Character, Party, PDetailDialog } from '../../types';

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

function DetailDialog({ id, visible, sendDataToParent }: Readonly<PDetailDialog>){
    const [dataCharacters, setDataCharacters] = useState<Character[]>([]);
    const [dataGroupe, setDataGroupe] = useState<Party | null>(null);

    function closeModal(){
        sendDataToParent(false);
    }

    function getData(){
        fetch(`${expressUrl}/compose/` + id)
        .then(response => response.json())
        .then(data => setDataCharacters(data));

        fetch(`${expressUrl}/parties/` + id)
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