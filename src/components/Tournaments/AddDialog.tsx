import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';

function AddDialog({ visible, sendDataToParent, dungeonsOption, partiesOption}){
    const [data, setData] = useState({});

    function closeModal(){
        setData({});
        sendDataToParent(false);
    }

    async function addTournament(){
        const body = {
            name: data.name,
            start_date: data.start_date,
            end_date: data.end_date,
            participation_right: data.participation_right,
            description: data.description,
            dungeons: data.dungeons,
            parties: data.parties
        };

        await fetch("http://localhost:3000/tournaments", {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        closeModal();
    }

    return(
        <Dialog header="Ajouter un tournoi" visible={visible} onHide={() => closeModal()}>
            <div className="form-style">
                <div className="form-line-style">
                    <label>Nom :</label>
                    <InputText className="input-style" value={data.name} onChange={(e) => setData((data) => ({ ...data, name: e.target.value}))} name="Nom" />
                </div>

                <div className="form-line-style">
                    <label>Date de début :</label>
                    <Calendar className="input-style" value={data.start_date} onChange={(e) => setData((data) => ({ ...data, start_date: e.value}))} name="DateDebut" />
                </div>

                <div className="form-line-style">
                    <label>Date de fin :</label>
                    <Calendar className="input-style" value={data.end_date} onChange={(e) => setData((data) => ({ ...data, end_date: e.value}))} name="DateFin" />
                </div>

                <div className="form-line-style">
                    <label>Droit de participation :</label>
                    <InputNumber className="input-style" value={data.participation_right} onChange={(e) => setData((data) => ({ ...data, participation_right: e.value}))} name="DroitParticipation" />
                </div>

                <div className="form-line-style">
                    <label>Description :</label>
                    <InputText className="input-style" value={data.description} onChange={(e) => setData((data) => ({ ...data, description: e.target.value}))} name="Description" />
                </div>

                <div className="form-line-style">
                    <label>Sélection des donjons :</label>
                    <MultiSelect className="input-style" value={data.dungeons} onChange={(e) => setData((data) => ({ ...data, dungeons: e.value}))} options={dungeonsOption} optionLabel="name" display="chip" />
                </div>

                <div className="form-line-style">
                    <label>Sélection des équipes :</label>
                    <MultiSelect className="input-style" value={data.parties} onChange={(e) => setData((data) => ({ ...data, parties: e.value}))} options={partiesOption} optionLabel="party_name" display="chip" />
                </div>

                <Button onClick={addTournament} label="Ajouter" />
            </div>
        </Dialog>
    )
}

export default AddDialog;