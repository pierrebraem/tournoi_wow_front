import { useState } from "react";
import Error from "../Error/Error";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { NumberInput, TextInput, DropdownInput } from "../Communs/Inputs";
import { Character, CharacterInput, CDialog, Role, ErrorType } from "../../types";
import { characterSchema }from "../../schemas/characters";
import * as z from "zod";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

const EMPTY_CHARACTER: Character = {
    name: "",
    class: { id: 0, label: "" },
    role: { id: 0, label: "" },
    ilvl: 0,
    rio: 0,
};

function CharacterDialog({ visible, sendDataToParent, classOption, id }: Readonly<CDialog>){
    const [data, setData] = useState<Character>(EMPTY_CHARACTER)
    const [apiError, setApiError] = useState<ErrorType | null>(null)
    const [formErrors, setFormErrors] = useState(null);
    const [visibleError, setVisibleError] = useState<boolean>(false)
    const [roleOption, setRoleOption] = useState<Role[]>([])

    function closeModal(){
        setRoleOption([])
        setData(EMPTY_CHARACTER)
        setFormErrors(null);

        sendDataToParent()
    }

    function checkErrors(character: CharacterInput){
        const result = characterSchema.safeParse(character);

        if(!result.success){
            const formatedErrors = z.flattenError(result.error);
            setFormErrors(formatedErrors.fieldErrors);
        }

        return result.success;
    }

    async function getRoles(value: Role){
        try{
            setData((prevData) => ({ ...prevData, class: { id: value.id, label: value.label } }))
            const rolesResponse = await fetch(`${expressUrl}/canbe/class/` + value.id)
            const roles = await rolesResponse.json()
            setRoleOption(roles)
        }
        catch(error){
            console.error(error)
        }
    }

    async function getData(){
        if (id == null) return;

        try{
            const characterResponse = await fetch(`${expressUrl}/characters/` + id)
            const character = await characterResponse.json()
            setData(character)

            const rolesResponse = await fetch(`${expressUrl}/canbe/class/` + character?.class?.id)
            const roles = await rolesResponse.json()
            setRoleOption(roles)
        }
        catch(error){
            console.error(error)
        }
    }

    async function submit(){
        const method = id == null ? 'post' : 'put'
        const baseUrl = `${expressUrl}/characters/`
        const url = id == null ? baseUrl : baseUrl + id
        const successStatusCode = id == null ? 201 : 200

        const body = {
            name: data?.name,
            class_id: data?.class.id,
            role_id: data?.role.id,
            ilvl: data?.ilvl,
            rio: data?.rio
        }

        const errorSuccess = checkErrors(body);
        if(!errorSuccess) return false;

        const res = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        if(res.status != successStatusCode){
            const json = await res.json()
            setVisibleError(true);
            setApiError({
                status: res.status,
                message: json.message,
            })
            return
        }

        closeModal()
    }

    return(
        <>
            <Dialog header={id == null ? "Ajouter un personnage" : "Modifier un personnage"} visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div className="form-style">
                    <div className="form-line-style">
                        <label htmlFor="character-name">Nom :</label>
                        <TextInput id="character-name" value={data?.name} error={formErrors?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value }))} name="Nom" />
                    </div>
                    
                    <div className="form-line-style">
                        <label htmlFor="character-class">Classe :</label>
                        <DropdownInput id="character-class" value={data?.class} error={formErrors?.class_id} onChange={(e) => getRoles(e.value)} options={classOption} placeholder="Sélectionner une classe" name="Classe" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-role">Rôle :</label>
                        <DropdownInput id="character-role" value={data?.role} error={formErrors?.role_id} onChange={(e) => setData((prevData) => ({ ...prevData, role: { id: e.value.id, label: e.value.label } }))} options={roleOption} placeholder="Sélectionner un rôle" name="Role" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-ilvl">ilvl :</label>
                        <NumberInput id="character-ilvl" value={data?.ilvl} error={formErrors?.ilvl} min={0} max={645} onChange={(e) => setData((prevData) => ({ ...prevData, ilvl: e.value ?? 0 }))} name="ilvl" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-rio">rio :</label>
                        <NumberInput id="character-rio" value={data?.rio} error={formErrors?.rio} min={0} max={4500} onChange={(e) => setData((prevData) => ({ ...prevData, rio: e.value ?? 0 }))} name="rio" />
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={apiError?.status ?? null} message={apiError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default CharacterDialog