import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function AddDialog({ visible, sendDataToParent }){
    const [name, setName] = useState("");
    
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [charactersOption, setCharactersOption] = useState([]);

    function closeModal(){
        setName("");

        setSelectedCharacters([]);
        setCharactersOption([]);

        sendDataToParent(false);
    }

    async function addParty(){
        const body = {
            name: name,
            characters: selectedCharacters
        };

        await fetch("http://localhost:3000/parties", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        closeModal();
    }

    useEffect(() => {
        fetch("http://localhost:3000/characters")
        .then(response => response.json())
        .then(data => setCharactersOption(data))
    });

    return (
        <>
            <Dialog header="Ajouter un groupe" visible={visible} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <label>Selection des personnages :</label>
                    <MultiSelect value={selectedCharacters} onChange={(e) => setSelectedCharacters(e.value)} options={charactersOption} optionLabel="name" display="chip"
                        maxSelectedLabels={5} />
                </div>

                <Button onClick={addParty} label="Ajouter" />
            </Dialog>
        </>
    )
}

export default AddDialog;