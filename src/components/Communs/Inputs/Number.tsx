import { InputNumber } from "primereact/inputnumber";
import type { NumberType } from "../../../types";

function NumberInput({ id, value, onChange, name }: Readonly<NumberType>){
    return(
        <InputNumber id={id} className="input-style" value={value} onChange={onChange} name={name} locale="fr-FR" />
    )
}

export default NumberInput