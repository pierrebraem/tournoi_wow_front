import { useState } from 'react';
import Error from "../Error/Error";
import { Dialog } from 'primereact/dialog';
import { Character, CDetailDialog, ErrorType } from '../../types';
import { getCharacter } from '../../utils/api';

function DetailDialog({ id, visible, sendDataToParent }: Readonly<CDetailDialog>){
    const [data, setData] = useState<Character | null>(null);
    const [apiError, setApiError] = useState<ErrorType | null>(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);

    function closeModal(){
        sendDataToParent();
    }

    async function getData(){
        try{
            if (id == null) return;
            const res = await getCharacter(id);

            if(res.status != 200){
                setVisibleError(true);
                setApiError({
                    status: res.status,
                    message: res.message
                });
                return;
            }

            setData(res.data);
        }
        catch(error){
            console.error(error);
        }
    }

    return(
        <>
            <Dialog header={"Détail du personnage " + data?.name} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <p>Nom : {data?.name}</p>
                    <p>Classe : {data?.class.label}</p>
                    <p>Rôle : {data?.role.label}</p>
                    <p>ilvl : {data?.ilvl}</p>
                    <p>rio : {data?.rio}</p>
                </div>
            </Dialog>
            <Error status={apiError?.status ?? null} message={apiError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)} />
        </>
    );
}

export default DetailDialog;