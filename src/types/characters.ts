import { Class } from "./classes"
import { Role } from "./roles"

export interface Character{
    id?: number,
    name: string,
    class: Class,
    role: Role,
    ilvl: number,
    rio: number,
}

export interface CDetailDialog{
    id: number | null,
    visible: boolean,
    sendDataToParent: () => void,
}

export interface CDialog extends CDetailDialog{
    classOption: Class[],
}