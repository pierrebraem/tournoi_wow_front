import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import type { DialogSupprType } from "../../types";

export function showConfirmDelete({message, header, accept}: DialogSupprType) {
    confirmDialog({
        message: message,
        header: header ?? "Suppression",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: accept,
    })
}

function DialogSuppr(){
    return(
        <ConfirmDialog />
    )
}

export default DialogSuppr