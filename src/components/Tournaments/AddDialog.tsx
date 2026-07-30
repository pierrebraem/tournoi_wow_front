import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { TournamentInput, TDialogDetail } from '../../types/tournaments';

const EMPTY_TOURNAMENT: TournamentInput = {
    name: "",
    start_date: null,
    end_date: null,
    participation_right: null,
    description: "",
    dungeons: [],
    parties: [],
};

function AddDialog({ visible, sendDataToParent, dungeonsOption, partiesOption}: Readonly<TDialogDetail>){
    const [data, setData] = useState<TournamentInput>(EMPTY_TOURNAMENT);

    function closeModal(){
        setData(EMPTY_TOURNAMENT);
        sendDataToParent(false);
    }

    async function addTournament(){
        const body = {
            name: data?.name,
            start_date: data?.start_date,
            end_date: data?.end_date,
            participation_right: data?.participation_right,
            description: data?.description,
            dungeons: data?.dungeons,
            parties: data?.parties
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
                    <label htmlFor="tournament-name">Nom :</label>
                    <InputText id="tournament-name" className="input-style" value={data?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value}))} name="Nom" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-start-date">Date de début :</label>
                    <Calendar id="tournament-start-date" className="input-style" value={data?.start_date ?? null} onChange={(e) => setData((prevData) => ({ ...prevData, start_date: e.value ?? null }))} name="DateDebut" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-end-date">Date de fin :</label>
                    <Calendar id="tournament-end-date" className="input-style" value={data?.end_date ?? null} onChange={(e) => setData((prevData) => ({ ...prevData, end_date: e.value ?? null }))} name="DateFin" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-participation-right">Droit de participation :</label>
                    <InputNumber id="tournament-participation-right" className="input-style" value={data?.participation_right} onChange={(e) => setData((prevData) => ({ ...prevData, participation_right: e.value}))} name="DroitParticipation" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-description">Description :</label>
                    <InputText id="tournament-description" className="input-style" value={data?.description} onChange={(e) => setData((prevData) => ({ ...prevData, description: e.target.value}))} name="Description" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-dungeons">Sélection des donjons :</label>
                    <MultiSelect id="tournament-dungeons" className="input-style" value={data?.dungeons} onChange={(e) => setData((prevData) => ({ ...prevData, dungeons: e.value}))} options={dungeonsOption} optionLabel="name" display="chip" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-parties">Sélection des équipes :</label>
                    <MultiSelect id="tournament-parties" className="input-style" value={data?.parties} onChange={(e) => setData((prevData) => ({ ...prevData, parties: e.value}))} options={partiesOption} optionLabel="party_name" display="chip" />
                </div>

                <Button onClick={addTournament} label="Ajouter" />
            </div>
        </Dialog>
    )
}

export default AddDialog;