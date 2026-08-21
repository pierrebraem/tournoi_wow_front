import { TournamentInput } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getTournaments(){
    const res = await fetch(`${expressUrl}/tournaments`);
    const tournaments = await res.json();
    const status = res.status;
    return { status, data: tournaments };
}

export async function postTournament(body: TournamentInput){
    const res = await fetch(`${expressUrl}/tournaments/`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const status = res.status;
    return status;
}

export async function deleteTournament(id: number){
    const res = await fetch(`${expressUrl}/tournaments/${id}`, {
        method: "delete",
    });
    const status = res.json();
    return status;
}