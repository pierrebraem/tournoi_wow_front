import { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function EditDialog({ visible, sendDataToParent, id }){
    const [name, setName] = useState("");

    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [charactersOption, setCharactersOption] = useState([]);

    function closeModal(){
        setName("");

        setSelectedCharacters([]);
        setCharactersOption([]);

        sendDataToParent(false);
    }

    async function editParty(){
        const body = {
            name: name,
            characters: selectedCharacters
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
        .then(data => setName(data[0].party_name));

        fetch("http://localhost:3000/compose/" + id)
        .then(response => response.json())
        .then(data => setSelectedCharacters(data));
    }

    useEffect(() => {
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharactersOption(data))
    });

    return (
        <>
            <Dialog header="Modifier un groupe" visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <label>Selection des personnages :</label>
                    <MultiSelect value={selectedCharacters} onChange={(e) => setSelectedCharacters(e.value)} options={charactersOption} optionLabel="name" display="chip"
                        maxSelectedLabels={5} />
                </div>

                <Button onClick={editParty} label="Modifier" />
            </Dialog>
        </>
    )
}

export default EditDialog