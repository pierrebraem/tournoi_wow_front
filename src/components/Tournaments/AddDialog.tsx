import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { CalendarInput, NumberInput, TextInput, MultiSelectInput } from '../Communs/Inputs';
import { TournamentInput, TournamentErrors, TDialogDetail } from '../../types';
import { tournamentSchema } from '../../schemas/tournaments';
import * as z from "zod";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

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
    const [formErrors, setFormErrors] = useState<TournamentErrors | null>(null);

    function closeModal(){
        setData(EMPTY_TOURNAMENT);
        setFormErrors(null);
        sendDataToParent();
    }

    function checkErrors(tournament: TournamentInput){
        const result = tournamentSchema.safeParse(tournament)

        if(!result.success){
            const formatedErrors = z.flattenError(result.error);
            setFormErrors(formatedErrors.fieldErrors);
        }

        return result.success;
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

        const errorSuccess = checkErrors(body);
        if(!errorSuccess) return false;

        await fetch(`${expressUrl}/tournaments`, {
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
                    <TextInput id="tournament-name" value={data?.name} error={formErrors?.name} onChange={(e) => setData((prevData) => ({ ...prevData, name: e.target.value}))} name="Nom" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-start-date">Date de début :</label>
                    <CalendarInput id="tournament-start-date" value={data?.start_date ?? null} error={formErrors?.start_date} onChange={(e) => setData((prevData) => ({ ...prevData, start_date: e.value ?? null }))} name="DateDebut" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-end-date">Date de fin :</label>
                    <CalendarInput id="tournament-end-date" value={data?.end_date ?? null} error={formErrors?.end_date} onChange={(e) => setData((prevData) => ({ ...prevData, end_date: e.value ?? null }))} name="DateFin" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-participation-right">Droit de participation :</label>
                    <NumberInput id="tournament-participation-right" value={data?.participation_right} error={formErrors?.participation_right} onChange={(e) => setData((prevData) => ({ ...prevData, participation_right: e.value}))} name="DroitParticipation" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-description">Description :</label>
                    <TextInput id="tournament-description" value={data?.description} error={formErrors?.description} onChange={(e) => setData((prevData) => ({ ...prevData, description: e.target.value}))} name="Description" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-dungeons">Sélection des donjons :</label>
                    <MultiSelectInput id="tournament-dungeons" value={data?.dungeons} error={formErrors?.dungeons} onChange={(e) => setData((prevData) => ({ ...prevData, dungeons: e.value}))} options={dungeonsOption} name="Donjons" />
                </div>

                <div className="form-line-style">
                    <label htmlFor="tournament-parties">Sélection des équipes :</label>
                    <MultiSelectInput id="tournament-parties" value={data?.parties} error={formErrors?.parties} min={2} onChange={(e) => setData((prevData) => ({ ...prevData, parties: e.value}))} options={partiesOption} name="Equipes" />
                </div>

                <Button onClick={addTournament} label="Ajouter" />
            </div>
        </Dialog>
    )
}

export default AddDialog;