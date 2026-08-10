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