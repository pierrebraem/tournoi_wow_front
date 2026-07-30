import { useState } from 'react';
import Error from '../Error/Error';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { PDetail, PartyInput } from '../../types/parties';
import { ErrorType } from '../../types/errors';

const EMPTY_PARTY: PartyInput = {
    name: "",
    characters: []
}

function PartyDialog({ visible, sendDataToParent, charactersOption, id }: Readonly<PDetail>) {
    const [data, setData] = useState<PartyInput>(EMPTY_PARTY)
    const [dataError, setDataError] = useState<ErrorType | null>(null)
    const [visibleError, setVisibleError] = useState<boolean>(false)

    function closeModal() {
        setData(EMPTY_PARTY)
        sendDataToParent(false)
    }

    function getData(){
        if(id == null) return;

        fetch("http://localhost:3000/parties/" + id)
        .then(response => response.json())
        .then(data => setData((prevData) => ({ ...prevData, name: data[0].party_name } )));

        fetch("http://localhost:3000/compose/" + id)
        .then(response => response.json())
        .then(data => setData((prevData) => ({ ...prevData, characters: data})));
    }

    async function submit() {
        const method = id == null ? 'post' : 'put'
        const baseUrl = "http://localhost:3000/parties/"
        const url = id == null ? baseUrl : baseUrl + id
        const successStatusCode = id == null ? 201 : 200

        const body = {
            name: data?.name,
            characters: data?.characters
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
                        <label htmlFor="party-name">Nom :</label>
                        <InputText id="party-name" className="input-style" value={data?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value}))} name="Nom" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="party-characters">Selection des personnages :</label>
                        <MultiSelect id="party-characters" className="input-style" value={data?.characters} onChange={(e) => setData((prevData) => ({ ...prevData, characters: e.value}))} options={charactersOption} optionLabel="name" display="chip"
                            maxSelectedLabels={5} name="Personnages"/>
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={dataError?.status ?? null} message={dataError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default PartyDialog