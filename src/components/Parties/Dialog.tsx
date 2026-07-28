import { useState } from 'react';
import Error from '../Error/Error';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function PartyDialog({ visible, sendDataToParent, charactersOption, id }) {
    const [data, setData] = useState({})
    const [dataError, setDataError] = useState({})
    const [visibleError, setVisibleError] = useState(false)

    function closeModal() {
        setData({})
        sendDataToParent(false)
    }

    function getData(){
        if(id == null) return;

        fetch("http://localhost:3000/parties/" + id)
        .then(response => response.json())
        .then(data => setData({name: data[0].party_name}));

        fetch("http://localhost:3000/compose/" + id)
        .then(response => response.json())
        .then(data => setData((data2) => ({ ...data2, characters: data})));
    }

    async function submit() {
        const method = id == null ? 'post' : 'put'
        const baseUrl = "http://localhost:3000/parties/"
        const url = id == null ? baseUrl : baseUrl + id
        const successStatusCode = id == null ? 201 : 200

        const body = {
            name: data.name,
            characters: data.characters
        }

        const res = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        if(res.status != successStatusCode) {
            const json = await res.json();
            setVisibleError(true);
            setDataError({
                status: res.status,
                message: json.message
            });
            return;
        }

        closeModal()
    }

    return (
        <>
            <Dialog header={id == null ? "Ajouter un groupe" : "Modifier un groupe"} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div className="form-style">
                    <div className="form-line-style">
                        <label>Nom :</label>
                        <InputText className="input-style" value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value}))} name="Nom" />
                    </div>

                    <div className="form-line-style">
                        <label>Selection des personnages :</label>
                        <MultiSelect className="input-style" value={data.characters} onChange={(e) => setData((data) => ({ ...data, characters: e.value}))} options={charactersOption} optionLabel="name" display="chip"
                            maxSelectedLabels={5} name="Personnages"/>
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={dataError.status} message={dataError.message} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default PartyDialog