import { CharacterInput } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getCharacters(){
    const res = await fetch(`${expressUrl}/characters`);
    const characters = await res.json();
    const status = res.status;
    return { status, data: characters };
}

export async function getCharacter(id: number){
    const res = await fetch(`${expressUrl}/characters/${id}`);
    const character = await res.json();
    const status = res.status;
    return { status, data: character };
}

export async function postCharacter(body: CharacterInput){
    const res = await fetch(`${expressUrl}/characters/`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const json = await res.json();
    const message = json.message;
    const status = res.status;
    return { status, message };
}

export async function putCharacter(id: number, body: CharacterInput){
    const res = await fetch(`${expressUrl}/characters/${id}/`, {
        method: "put",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });
    const json = await res.json();
    const message = json.message;
    const status = res.status;
    return { status, message };
}

export async function deleteCharacter(id: number){
    const res = await fetch(`${expressUrl}/characters/${id}`, {
        method: "delete"
    });
    const status = res.status;
    return status;
}