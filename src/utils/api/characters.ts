import { CharacterInput } from "../../types";

const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getCharacters(){
    const res = await fetch(`${expressUrl}/characters`);
    const json = await res.json();
    const status = res.status;

    if (status != 200){
        return { status, message: json.message };
    }

    return { status, data: json };
}

export async function getCharacter(id: number){
    const res = await fetch(`${expressUrl}/characters/${id}`);
    const json = await res.json();
    const status = res.status;

    if (status != 200){
        return { status, message: json.message };
    }
    
    return { status, data: json };
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
    const json = await res.json();
    const message = json.message;
    const status = res.status;
    return { status, message };
}