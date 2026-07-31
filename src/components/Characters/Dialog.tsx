import { useState } from "react";
import Error from "../Error/Error";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Character, CDialog } from "../../types/characters";
import { Role } from "../../types/roles";
import { ErrorType } from "../../types/errors";

const EMPTY_CHARACTER: Character = {
    name: "",
    class: { id: 0, label: "" },
    role: { id: 0, label: "" },
    ilvl: 0,
    rio: 0,
};

function CharacterDialog({ visible, sendDataToParent, classOption, id }: Readonly<CDialog>){
    const [data, setData] = useState<Character>(EMPTY_CHARACTER)
    const [dataError, setDataError] = useState<ErrorType | null>(null)
    const [visibleError, setVisibleError] = useState<boolean>(false)
    const [roleOption, setRoleOption] = useState<Role[]>([])

    function closeModal(){
        setRoleOption([])
        setData(EMPTY_CHARACTER)

        sendDataToParent()
    }

    function getRoles(value: Role){
        setData((prevData) => ({ ...prevData, class: { id: value.id, label: value.label } }))
        fetch("http://localhost:3000/canbe/class/" + value.id)
        .then(response => response.json())
        .then(data => setRoleOption(data))
    }

    async function getData(){
        if (id == null) return;

        try {
            const characterResponse = await fetch("http://localhost:3000/characters/" + id)
            const character = await characterResponse.json()
            setData(character)

            const rolesResponse = await fetch("http://localhost:3000/canbe/class/" + character?.class?.id)
            const roles = await rolesResponse.json()
            setRoleOption(roles)
        } catch (error) {
            console.error(error)
        }
    }

    async function submit(){
        const method = id == null ? 'post' : 'put'
        const baseUrl = "http://localhost:3000/characters/"
        const url = id == null ? baseUrl : baseUrl + id
        const successStatusCode = id == null ? 201 : 200

        const body = {
            name: data?.name,
            class_id: data?.class.id,
            role_id: data?.role.id,
            ilvl: data?.ilvl,
            rio: data?.rio
        }

        const res = await fetch(url, {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })

        if(res.status != successStatusCode){
            const json = await res.json()
            setVisibleError(true);
            setDataError({
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
                        <InputText id="character-name" className="input-style" value={data?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value }))} name="Nom" />
                    </div>
                    
                    <div className="form-line-style">
                        <label htmlFor="character-class">Classe :</label>
                        <Dropdown inputId="character-class" className="input-style" value={data?.class} onChange={(e) => getRoles(e.value)} options={classOption} optionLabel="label" placeholder="Sélectionner une classe" name="Classe" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-role">Rôle :</label>
                        <Dropdown inputId="character-role" className="input-style" value={data?.role} onChange={(e) => setData((prevData) => ({ ...prevData, role: { id: e.value.id, label: e.value.label } }))} options={roleOption} optionLabel="label" placeholder="Sélectionner un rôle" name="Role" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-ilvl">ilvl :</label>
                        <InputNumber id="character-ilvl" className="input-style" value={data?.ilvl} onChange={(e) => setData((prevData) => ({ ...prevData, ilvl: e.value ?? 0 }))} name="ilvl" />
                    </div>

                    <div className="form-line-style">
                        <label htmlFor="character-rio">rio :</label>
                        <InputNumber id="character-rio" className="input-style" value={data?.rio} onChange={(e) => setData((prevData) => ({ ...prevData, rio: e.value ?? 0 }))} name="rio" />
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={dataError?.status ?? null} message={dataError?.message ?? null} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default CharacterDialog