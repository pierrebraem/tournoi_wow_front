import { Dialog } from "primereact/dialog"
import { useState } from "react";
import { Button } from "primereact/button";
import { DropdownInput } from "../Communs/Inputs";
import { Party, Challenge, TDialogView } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

function ViewDialog({ visible, sendDataToParent, id, partiesOption }: Readonly<TDialogView>){
    const [dataParties, setDataParties] = useState<Party[]>([]);
    const [dataChallenges, setDataChallenges] = useState<Challenge[]>([]);
    const [party, setParty] = useState<Party | null>(null);

    function closeModal(){
        sendDataToParent();
    }

    async function getData(){
        try{
            const partiesResponse = await fetch(`${expressUrl}/registered/` + id)
            const parties = await partiesResponse.json()
            setDataParties(parties)

            const challengesResponse = await fetch(`${expressUrl}/challenge/` + id)
            const challenges = await challengesResponse.json()
            setDataChallenges(challenges)
        }
        catch(error){
            console.error(error)
        }
    }

    async function addParty(){
        const body = {
            id: party?.id,
            name: party?.name
        };

        await fetch(`${expressUrl}/registered/` + id, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        getData();
    }

    async function done(challenge_id: number, dungeos_id: number, party_id: number){
        const body = {
            challenge_id: challenge_id,
            dungeos_id: dungeos_id,
            party_id: party_id
        }
        await fetch(`${expressUrl}/registered/done`, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        getData();
    }
    
    return(
        <Dialog header="Vue d'un tournoi" visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
            <div>
                <p>Gestion des équipes</p>
                <ul>
                    {dataParties.map(party => (
                        <li>{party.id} {party.name}</li>
                    ))}
                </ul>

                <label>Ajouter une équipe</label>
                <DropdownInput id="changeitlater" value={party} onChange={(e) => setParty(e.value)} options={partiesOption} name="changeitlater" />
                <Button label="Ajouter équipe" onClick={addParty}/>
            </div>

            <div>
                <p>Réalisation d'un donjon</p>
                <ul>
                    {dataChallenges.map(challenge => (
                        <li>{challenge.name} {challenge.name} {challenge.done ? "Fait ": "Non fait "} {challenge.done ? <Button label="Non terminé" onClick={() => undone(challenge.challenge_id, challenge.dungeos_id, challenge.party_id)}/>: <Button label="Terminé" onClick={() => done(challenge.challenge_id, challenge.dungeos_id, challenge.party_id)} />}</li>
                    ))}
                </ul>
            </div>
        </Dialog>
    )
}

export default ViewDialog