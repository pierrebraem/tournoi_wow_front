import { Character } from "./characters";

export interface Party{
    id: number,
    name: string,
}

export interface PartyInput{
    name: string,
    characters: Character[]
}

export interface PDetailDialog{
    id: number  | null,
    visible: boolean,
    sendDataToParent: () => void,
}

export interface PDetail extends PDetailDialog{
    charactersOption: Character[]
}