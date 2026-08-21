import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Character, Party, PDetailDialog } from '../../types';
import { getLinkedCharacters, getParty } from '../../utils/api';

function DetailDialog({ id, visible, sendDataToParent }: Readonly<PDetailDialog>){
    const [dataCharacters, setDataCharacters] = useState<Character[]>([]);
    const [dataGroupe, setDataGroupe] = useState<Party | null>(null);

    function closeModal(){
        sendDataToParent();
    }

    async function getData(){
        try{
            if (id == null) return;

            const [resCharacters, resParty] = await Promise.all([
                getLinkedCharacters(id),
                getParty(id),
            ]);

            setDataCharacters(resCharacters.data);
            setDataGroupe(resParty.data);
        }
        catch(error){
            console.error(error);
        }
    }

    return(
        <Dialog header={"Détail du groupe " + dataGroupe?.name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
            <p>Id : {dataGroupe?.id}</p>
            <p>Nom : {dataGroupe?.name}</p>
                
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
    );
}

export default DetailDialog;