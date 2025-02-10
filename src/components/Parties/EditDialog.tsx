import { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function EditDialog({ visible, sendDataToParent, charactersOption, id }){
    const [data, setData] = useState({});

    function closeModal(){
        sendDataToParent(false);
    }

    async function editParty(){
        const body = {
            name: data.name,
            characters: data.characters
        }

        await fetch("http://localhost:3000/parties/" + id, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        closeModal();
    }

    function getData(){
        fetch("http://localhost:3000/parties/" + id)
        .then(response => response.json())
        .then(data => setData({name: data[0].party_name}));

        fetch("http://localhost:3000/compose/" + id)
        .then(response => response.json())
        .then(data => setData((data2) => ({ ...data2, characters: data})));
    }

    return (
        <>
            <Dialog header="Modifier un groupe" visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value}))} />
                </div>

                <div>
                    <label>Selection des personnages :</label>
                    <MultiSelect value={data.characters} onChange={(e) => setData((data) => ({ ...data, characters: e.value}))} options={charactersOption} optionLabel="name" display="chip"
                        maxSelectedLabels={5} />
                </div>

                <Button onClick={editParty} label="Modifier" />
            </Dialog>
        </>
    )
}

export default EditDialog