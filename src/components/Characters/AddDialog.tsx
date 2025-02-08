import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

function AddDialog({ visible, sendDataToParent }){
    const [name, setName] = useState("");

    const [selectedClass, setSelectedClass] = useState({});
    const [classOption, setClassOption] = useState([]);

    const [selectedRole, setSelectedRole] = useState({});
    const [roleOption, setRoleOption] = useState([]);

    const [ilvl, setIlvl] = useState(0);
    const [rio, setRio] = useState(0);

    function closeModal(){
        setName("");
        setSelectedClass({});
        setSelectedRole({});
        setRoleOption([]);
        setIlvl(0);
        setRio(0);

        sendDataToParent(false);
    }

    async function addCharacters(){
        const body = {
            name: name,
            class_id: selectedClass.id,
            role_id: selectedRole.id,
            ilvl: ilvl,
            rio: rio
        };

        await fetch("http://localhost:3000/characters", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });
        
        closeModal();
    }

    function getRoles(value){
        setSelectedClass(value);
        fetch("http://localhost:3000/canbe/class/" + value.id)
        .then(response => response.json())
        .then(data => setRoleOption(data));
    }

    useEffect(() => {
        fetch("http://localhost:3000/class")
        .then(response => response.json())
        .then(data => setClassOption(data))
    }, [])

    return(
        <>
            <Dialog header="Ajouter un personnage" visible={visible} onHide={() => closeModal()}>
                <div>
                    <label>Nom :</label>
                    <InputText value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div>
                    <label>Classe :</label>
                    <Dropdown value={selectedClass} onChange={(e) => getRoles(e.value)} options={classOption} optionLabel="label" placeholder="Sélectionner une classe"/>
                </div>

                <div>
                    <label>Rôle :</label>
                    <Dropdown value={selectedRole} onChange={(e) => setSelectedRole(e.value)} options={roleOption} optionLabel="label" placeholder="Sélectionner un rôle"/>
                </div>

                <div>
                    <label>ilvl :</label>
                    <InputNumber value={ilvl} onChange={(e) => setIlvl(e.value)} />
                </div>

                <div>
                    <label>rio :</label>
                    <InputNumber value={rio} onChange={(e) => setRio(e.value)} />
                </div>

                <Button onClick={addCharacters} label="Ajouter" />
            </Dialog>
        </>
    )
}

export default AddDialog;