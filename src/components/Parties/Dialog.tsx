import { useState } from 'react';
import Error from '../Error/Error';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TextInput, MultiSelectInput } from '../Communs/Inputs';
import { PDetail, PartyInput, ErrorType } from '../../types';

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

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

        fetch(`${expressUrl}/parties/` + id)
        .then(response => response.json())
        .then(data => setData((prevData) => ({ ...prevData, name: data[0].party_name } )));

        fetch(`${expressUrl}/compose/` + id)
        .then(response => response.json())
        .then(data => setData((prevData) => ({ ...prevData, characters: data})));
    }

    async function submit() {
        const method = id == null ? 'post' : 'put'
        const baseUrl = `${expressUrl}/parties/`
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
                        <TextInput id="party-name" value={data?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value}))} name="Nom" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="party-characters">Selection des personnages :</label>
                        <MultiSelectInput id="party-characters" value={data?.characters} onChange={(e) => setData((prevData) => ({ ...prevData, characters: e.value}))} options={charactersOption} name="Personnages" />
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={dataError?.status ?? null} message={dataError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default PartyDialog