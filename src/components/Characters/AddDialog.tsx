import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function AddDialog({ visible, sendDataToParent, classOption }){
    const [data, setData] = useState({});
    const [roleOption, setRoleOption] = useState([]);

    function closeModal(){
        setRoleOption([]);
        setData({});

        sendDataToParent();
    }

    async function addCharacters(){
        const body = {
            name: data.name,
            class_id: data.class.id,
            role_id: data.role.id,
            ilvl: data.ilvl,
            rio: data.rio
        };

        await fetch("http://localhost:3000/characters", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        
        closeModal();
    }

    function getRoles(value){
        setData((data) => ({ ...data, class: {id: value.id, label: value.label}}));
        fetch("http://localhost:3000/canbe/class/" + value.id)
        .then(response => response.json())
        .then(data => setRoleOption(data));
    }

    return(
        <>
            <Dialog header="Ajouter un personnage" visible={visible} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value }))} name="Nom" />
                </div>
                
                <div>
                    <label>Classe :</label>
                    <Dropdown value={data.class} onChange={(e) => getRoles(e.value)} options={classOption} optionLabel="label" placeholder="Sélectionner une classe" name="Classe" />
                </div>

                <div>
                    <label>Rôle :</label>
                    <Dropdown value={data.role} onChange={(e) => setData((data) => ({ ...data, role: { id: e.value.id, label: e.value.label }}))} options={roleOption} optionLabel="label" placeholder="Sélectionner un rôle" name="Role" />
                </div>

                <div>
                    <label>ilvl :</label>
                    <InputNumber value={data.ilvl} onChange={(e) => setData((data) => ({ ...data, ilvl: e.value }))} name="ilvl" />
                </div>

                <div>
                    <label>rio :</label>
                    <InputNumber value={data.rio} onChange={(e) => setData((data) => ({ ...data, rio: e.value}))} name="rio" />
                </div>

                <Button onClick={addCharacters} label="Ajouter" name="AddButtonDialog" />
            </Dialog>
        </>
    )
}

export default AddDialog;