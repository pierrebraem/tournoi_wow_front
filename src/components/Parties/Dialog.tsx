import { useState } from 'react';
import Error from '../Error/Error';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TextInput, MultiSelectInput } from '../Communs/Inputs';
import { PDetail, PartyInput, PartyErrors, ErrorType } from '../../types';
import { partySchema } from '../../schemas/parties';
import * as z from "zod";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

const EMPTY_PARTY: PartyInput = {
    name: "",
    characters: []
};

function PartyDialog({ visible, sendDataToParent, charactersOption, id }: Readonly<PDetail>) {
    const [data, setData] = useState<PartyInput>(EMPTY_PARTY);
    const [apiError, setApiError] = useState<ErrorType | null>(null);
    const [formErrors, setFromErrors] = useState<PartyErrors | null>(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);

    function closeModal() {
        setData(EMPTY_PARTY);
        setFromErrors(null);
        sendDataToParent();
    }

    function checkErrors(party: PartyInput){
        const result = partySchema.safeParse(party);

        if(!result.success){
            const formatedErrors = z.flattenError(result.error);
            setFromErrors(formatedErrors.fieldErrors);
        }

        return result.success;
    }

    async function getData(){
        if(id == null) return;

        try{
            const partyResponse = await fetch(`${expressUrl}/parties/` + id);
            const party = await partyResponse.json();
            setData((prevData) => ({ ...prevData, name: party.name } ));

            const charactersResponse = await fetch(`${expressUrl}/compose/` + id);
            const characters = await charactersResponse.json();
            setData((prevData) => ({ ...prevData, characters: characters}));
        }
        catch(error){
            console.error(error);
        }
    }

    async function submit() {
        const method = id == null ? 'post' : 'put';
        const baseUrl = `${expressUrl}/parties/`;
        const url = id == null ? baseUrl : baseUrl + id;
        const successStatusCode = id == null ? 201 : 200;

        const body = {
            name: data?.name,
            characters: data?.characters
        };

        const errorSuccess = checkErrors(body);
        if(!errorSuccess) return false;

        const res = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        if(res.status != successStatusCode) {
            const json = await res.json();
            setVisibleError(true);
            setApiError({
                status: res.status,
                message: json.message
            });
            return;
        }

        closeModal();
    }

    return (
        <>
            <Dialog header={id == null ? "Ajouter un groupe" : "Modifier un groupe"} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div className="form-style">
                    <div className="form-line-style">
                        <label htmlFor="party-name">Nom :</label>
                        <TextInput id="party-name" value={data?.name} error={formErrors?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value}))} name="Nom" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="party-characters">Selection des personnages :</label>
                        <MultiSelectInput id="party-characters" value={data?.characters} error={formErrors?.characters} onChange={(e) => setData((prevData) => ({ ...prevData, characters: e.value}))} options={charactersOption} name="Personnages" />
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={apiError?.status ?? null} message={apiError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    );
}

export default PartyDialog;