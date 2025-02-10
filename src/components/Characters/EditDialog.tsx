import { useState } from "react"
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function EditDialog({ visible, sendDataToParent, classOption, id }){
    const [data, setData] = useState({});
    
    const [roleOption, setRoleOption] = useState([]);

    function closeModal(){
        setRoleOption([]);

        sendDataToParent();
    }

    function getData(){
        fetch("http://localhost:3000/characters/" + id)
        .then(response => response.json())
        .then(data => setData(data[0]));
    }

    function getRoles(value){
        setData((data) => ({ ...data, class: {id: value.id, label: value.label}}));
        fetch("http://localhost:3000/canbe/class/" + value.id)
        .then(response => response.json())
        .then(data => setRoleOption(data));
    }

    async function editCharacters(){
        const body = {
            name: data.name,
            class_id: data.class.id,
            role_id: data.role.id,
            ilvl: data.ilvl,
            rio: data.rio
        };

        await fetch("http://localhost:3000/characters/" + id, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        closeModal();
    }

    return (
        <>
            <Dialog header="Modifier un personnage" visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))} />
                </div>
                        
                <div>
                    <label>Classe :</label>
                    <Dropdown value={data.class} onChange={(e) => getRoles(e.value)} options={classOption} optionLabel="label" placeholder="Sélectionner une classe"/>
                </div>
        
                <div>
                    <label>Rôle :</label>
                    <Dropdown value={data.role} onChange={(e) => setData((data) => ({ ...data, role: { id: e.value.id, label: e.value.label }}))} options={roleOption} optionLabel="label" placeholder="Sélectionner un rôle"/>
                </div>
        
                <div>
                    <label>ilvl :</label>
                    <InputNumber value={data.ilvl} onChange={(e) => setData((data) => ({ ...data, ilvl: e.value }))} />
                </div>
        
                <div>
                    <label>rio :</label>
                    <InputNumber value={data.rio} onChange={(e) => setData((data) => ({ ...data, rio: e.value}))} />
                </div>
        
                <Button onClick={editCharacters} label="Modifier" />
            </Dialog>
        </>
    )
}

export default EditDialog