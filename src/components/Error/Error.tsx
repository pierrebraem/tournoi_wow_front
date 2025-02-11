import { Dialog } from "primereact/dialog";


function Error({ status, message, visible, sendDataToParent }){
    function closeModal(){
        sendDataToParent();
    }

    return(
        <Dialog header="Une erreur est survenue" visible={visible} onHide={() => closeModal()}>
            <p>Une erreur est survenu lors de l'exécution d'une ou de plusieurs requêtes</p>
            <p>{status} : {message}</p>
        </Dialog>
    )
}

export default Error;