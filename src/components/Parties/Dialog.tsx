import { useState, useRef } from 'react';
import Error from '../Error/Error';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TextInput, MultiSelectInput } from '../Communs/Inputs';
import { PDetail, PartyInput, PartyErrors, ErrorType } from '../../types';
import { getLinkedCharacters, getParty, postParty, putParty } from '../../utils/api';
import { partySchema } from '../../schemas/parties';
import * as z from "zod";

const EMPTY_PARTY: PartyInput = {
    name: "",
    characters: []
};

function PartyDialog({ visible, sendDataToParent, charactersOption, id }: Readonly<PDetail>) {
    const [data, setData] = useState<PartyInput>(EMPTY_PARTY);
    const [apiError, setApiError] = useState<ErrorType | null>(null);
    const [formErrors, setFromErrors] = useState<PartyErrors | null>(null);
    const [visibleError, setVisibleError] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

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
            const [resParty, resCharacters] = await Promise.all([
                getParty(id),
                getLinkedCharacters(id),
            ]);
            const party = resParty.data;
            const characters = resCharacters.data;

            setData((prevData) => ({ ...prevData, name: party.name } ));
            setData((prevData) => ({ ...prevData, characters: characters } ));
        }
        catch(error){
            console.error(error);
        }
    }

    async function submit() {
        const successStatusCode = id == null ? 201 : 200;

        const body = {
            name: data?.name,
            characters: data?.characters
        };

        const errorSuccess = checkErrors(body);
        if(!errorSuccess) return false;

        const res = id == null ? await postParty(body) : await putParty(id, body);

        if(res.status != successStatusCode) {
            setVisibleError(true);
            setApiError({
                status: res.status,
                message: res.message
            });
            return;
        }

        toast.current?.show({
            severity: 'success',
            summary: id == null ? 'Groupe ajouté' : 'Groupe mis à jour',
            detail: `Le groupe ${body.name} a été ${id == null ? 'ajouté' : 'mis à jour'} avec succès`,
            life: 5000,
        });

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
            <Toast ref={toast} />
        </>
    );
}

export default PartyDialog;