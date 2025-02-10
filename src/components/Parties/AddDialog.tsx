import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function AddDialog({ visible, sendDataToParent, charactersOption }){
    const [data, setData] = useState({});

    function closeModal(){
        setData({});
        sendDataToParent(false);
    }

    async function addParty(){
        const body = {
            name: data.name,
            characters: data.characters
        };

        await fetch("http://localhost:3000/parties", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        closeModal();
    }

    return (
        <>
            <Dialog header="Ajouter un groupe" visible={visible} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value}))} name="Nom" />
                </div>

                <div>
                    <label>Selection des personnages :</label>
                    <MultiSelect value={data.characters} onChange={(e) => setData((data) => ({ ...data, characters: e.value}))} options={charactersOption} optionLabel="name" display="chip"
                        maxSelectedLabels={5} />
                </div>

                <Button onClick={addParty} label="Ajouter" />
            </Dialog>
        </>
    )
}

export default AddDialog;