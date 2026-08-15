import type { ChangeEvent } from 'react';
import type { FormEvent } from 'primereact/ts-helpers';
import type { InputNumberChangeEvent } from 'primereact/inputnumber';
import type { DropdownChangeEvent } from 'primereact/dropdown';
import type { MultiSelectChangeEvent } from 'primereact/multiselect';
import type { Class, Role, Character, Dungeon, Party } from '.';

export interface InputsType<TOption = unknown> {
    id: string,
    name: string,
    placeholder?: string,
    options?: TOption[],
    error?: Array<string> | null,
}

export interface CalendarType extends InputsType {
    value: Date | null,
    onChange: (e: FormEvent<Date>) => void,
}

export interface NumberType extends InputsType {
    value: number | null,
    min?: number,
    max?: number,
    onChange: (e: InputNumberChangeEvent) => void,
}

export interface TextType extends InputsType {
    value: string | null,
    onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void,
}

export interface DropdownType<TOption extends { id: number; label: string; } = Class | Role> extends InputsType<TOption> {
    value: TOption | null,
    onChange: (e: DropdownChangeEvent) => void,
}

export interface MultiSelectType<TOption extends { id?: number; label?: string; name?: string } = Class | Role | Dungeon | Character | Party> extends InputsType<TOption> {
    value: TOption[] | null,
    min?: number,
    onChange: (e: MultiSelectChangeEvent) => void,
}

export interface DialogSupprType {
    message: string,
    header?: string,
    accept: () => void
}