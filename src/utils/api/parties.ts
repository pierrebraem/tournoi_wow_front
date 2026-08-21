import { PartyInput } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getParties(){
    const res = await fetch(`${expressUrl}/parties/`);
    const parties = await res.json();
    const status = res.status;
    return { status, data: parties };
}

export async function getParty(id: number){
    const res = await fetch(`${expressUrl}/parties/${id}`);
    const party = await res.json();
    const status = res.status;
    return { status, data: party };
}

export async function getLinkedCharacters(id: number){
    const res = await fetch(`${expressUrl}/compose/${id}`);
    const characters = await res.json();
    const status = res.status;
    return { status, data: characters };
}

export async function postParty(body: PartyInput){
    const res = await fetch(`${expressUrl}/parties/`, {
        method:"post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const json = await res.json();
    const message = json.message;
    const status = res.status;
    return { status, message };
}

export async function putParty(id: number, body: PartyInput){
    const res = await fetch(`${expressUrl}/parties/${id}/`, {
        method: "put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const json = await res.json();
    const message = json.message;
    const status = res.status;
    return { status, message };
}

export async function deleteParty(id: number){
    const res = await fetch(`${expressUrl}/parties/${id}`, {
        method: "delete",
    });
    const status = res.status;
    return status;
}