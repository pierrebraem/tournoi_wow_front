import { Dialog } from "primereact/dialog"
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

function ViewDialog({ visible, sendDataToParent, id, partiesOption }){
    const [dataParties, setDataParties] = useState([]);
    const [dataChallenges, setDataChallenges] = useState([]);
    const [party, setParty] = useState({});

    function closeModal(){
        sendDataToParent();
    }

    function getData(){
        fetch("http://localhost:3000/registered/" + id)
        .then(response => response.json())
        .then(data => setDataParties(data))

        fetch("http://localhost:3000/challenge/" + id)
        .then(response => response.json())
        .then(data => setDataChallenges(data))
    }

    async function addParty(){
        const body = {
            id: party.id,
            party_name: party.party_name
        };

        await fetch("http://localhost:3000/registered/" + id, {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        getData();
    }

    async function done(challenge_id, dungeos_id, party_id){
        const body = {
            challenge_id: challenge_id,
            dungeos_id: dungeos_id,
            party_id: party_id
        }
        await fetch("http://localhost:3000/registered/done", {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        });

        getData();
    }
    
    return(
        <>
            <Dialog header="Vue d'un tournoi" visible={visible} onShow={() => getData()} onHide={() => closeModal()}>
                <div>
                    <p>Gestion des équipes</p>
                    <ul>
                        {dataParties.map(party => (
                            <li>{party.id} {party.party_name}</li>
                        ))}
                    </ul>

                    <label>Ajouter une équipe</label>
                    <Dropdown value={party} onChange={(e) => setParty(e.value)} options={partiesOption} optionLabel="party_name" />
                    <Button label="Ajouter équipe" onClick={addParty}/>
                </div>

                <div>
                    <p>Réalisation d'un donjon</p>
                    <ul>
                        {dataChallenges.map(challenge => (
                            <li>{challenge.name} {challenge.party_name} {challenge.done ? "Fait ": "Non fait "} {challenge.done ? <Button label="Non terminé" onClick={() => undone(challenge.challenge_id, challenge.dungeos_id, challenge.party_id)}/>: <Button label="Terminé" onClick={() => done(challenge.challenge_id, challenge.dungeos_id, challenge.party_id)} />}</li>
                        ))}
                    </ul>
                </div>
            </Dialog>
        </>
    )
}

export default ViewDialog