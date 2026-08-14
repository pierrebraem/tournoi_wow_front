import { Dungeon } from "./dungeons";
import { Party } from "./parties";

export interface Tournament{
    id: number,
    name: string,
    start_date: Date | null,
    end_date: Date | null,
    participation_right: number | null,
    description: string,
    dungeons: Dungeon[],
    parties: Party[],
}

export interface TournamentInput{
    name: string,
    start_date: Date | null,
    end_date: Date | null,
    participation_right: number | null,
    description: string,
    dungeons: Dungeon[],
    parties: Party[],
}

export interface TournamentErrors{
    name?: Array<string>,
    start_date?: Array<string>,
    end_date?: Array<string>,
    participation_right?: Array<string>,
    description?: Array<string>,
    dungeons?: Array<string>,
    parties?: Array<string>,
}

export interface TDialog{
    visible: boolean,
    sendDataToParent: () => void,
    partiesOption: Party[],
}

export interface TDialogView extends TDialog{
    id: number | null
}

export interface TDialogDetail extends TDialog{
    dungeonsOption: Dungeon[]
}