import type { ChangeEvent } from 'react';
import type { FormEvent } from 'primereact/ts-helpers';
import type { InputNumberChangeEvent } from 'primereact/inputnumber';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import type { MultiSelectChangeEvent } from 'primereact/multiselect';

export interface InputsType {
    id: string,
    name: string,
    placeholder?: string,
    options?: Array<any>,
}

export interface CalendarType extends InputsType {
    value: Date | null,
    onChange: (e: FormEvent<Date>) => void,
}

export interface NumberType extends InputsType {
    value: number | null,
    onChange: (e: InputNumberChangeEvent) => void,
}

export interface TextType extends InputsType {
    value: string | null,
    onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void,
}

export interface DropdownType extends InputsType {
    value: any,
    onChange: (e: DropdownChangeEvent) => void,
}

export interface MultiSelectType extends InputsType {
    value: any,
    onChange: (e: MultiSelectChangeEvent) => void,
}

export interface DialogSupprType {
    message: string,
    header?: string,
    accept: () => void
}