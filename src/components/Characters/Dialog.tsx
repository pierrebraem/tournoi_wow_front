import { useState } from "react";
import Error from "../Error/Error";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";

function CharacterDialog({ visible, sendDataToParent, classOption, id }){
    const [data, setData] = useState({})
    const [dataError, setDataError] = useState({})
    const [visibleError, setVisibleError] = useState(false)
    const [roleOption, setRoleOption] = useState([])

    function closeModal(){
        setRoleOption([])
        setData({})

        sendDataToParent()
    }

    function getRoles(value){
        setData((data) => ({ ...data, class: {id: value.id, label: value.label}}))
        fetch("http://localhost:3000/canbe/class/" + value.id)
        .then(response => response.json())
        .then(data => setRoleOption(data))
    }

    function getData(){
        if (id == null) return;

        fetch("http://localhost:3000/characters/" + id)
        .then(response => response.json())
        .then(data => setData(data[0]))
    }

    async function submit(){
        const method = id == null ? 'post' : 'put'
        const baseUrl = "http://localhost:3000/characters/"
        const url = id == null ? baseUrl : baseUrl + id
        const successStatusCode = id == null ? 201 : 200

        const body = {
            name: data.name,
            class_id: data.class.id,
            role_id: data.role.id,
            ilvl: data.ilvl,
            rio: data.rio
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
                        <label>Nom :</label>
                        <InputText className="input-style" value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))} name="Nom" />
                    </div>
                    
                    <div className="form-line-style">
                        <label>Classe :</label>
                        <Dropdown className="input-style" value={data.class} onChange={(e) => getRoles(e.value)} options={classOption} optionLabel="label" placeholder="Sélectionner une classe" name="Classe" />
                    </div>

                    <div className="form-line-style">
                        <label>Rôle :</label>
                        <Dropdown className="input-style" value={data.role} onChange={(e) => setData((data) => ({ ...data, role: { id: e.value.id, label: e.value.label }}))} options={roleOption} optionLabel="label" placeholder="Sélectionner un rôle" name="Role" />
                    </div>

                    <div className="form-line-style">
                        <label>ilvl :</label>
                        <InputNumber className="input-style" value={data.ilvl} onChange={(e) => setData((data) => ({ ...data, ilvl: e.value }))} name="ilvl" />
                    </div>

                    <div className="form-line-style">
                        <label>rio :</label>
                        <InputNumber className="input-style" value={data.rio} onChange={(e) => setData((data) => ({ ...data, rio: e.value}))} name="rio" />
                    </div>

                    <Button onClick={submit} label={id == null ? "Ajouter" : "Modifier"} name="ButtonDialog" />
                </div>
            </Dialog>
            <Error status={dataError.status} message={dataError.message} visible={visibleError} sendDataToParent={() => setVisibleError(false)}/>
        </>
    )
}

export default CharacterDialog