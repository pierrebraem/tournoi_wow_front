import type { FormEvent } from 'primereact/ts-helpers';

export interface CalendrierType {
    id: string,
    value: Date | null,
    onChange: (e: FormEvent<Date>) => void,
    name: string,
}

export interface DialogSupprType {
    message: string,
    header?: string,
    accept: () => void
}