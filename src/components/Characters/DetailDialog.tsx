import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Character, CDetailDialog } from '../../types';

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

function DetailDialog({ id, visible, sendDataToParent }: Readonly<CDetailDialog>){
    const [data, setData] = useState<Character | null>(null);

    function closeModal(){
        sendDataToParent();
    }

    function getData(){
        fetch(`${expressUrl}/characters/` + id)
        .then(response => response.json())
        .then(data => setData(data));
    }

    return(
        <Dialog header={"Détail du personnage " + data?.name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
            <div>
                <p>Nom : {data?.name}</p>
                <p>Classe : {data?.class.label}</p>
                <p>Rôle : {data?.role.label}</p>
                <p>ilvl : {data?.ilvl}</p>
                <p>rio : {data?.rio}</p>
            </div>
        </Dialog>
    )
}

export default DetailDialog