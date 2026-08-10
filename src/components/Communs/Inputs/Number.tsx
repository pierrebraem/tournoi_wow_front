import { InputNumber } from "primereact/inputnumber";
import type { NumberType } from "../../../types";

function NumberInput({ id, value, onChange, name, error, min, max }: Readonly<NumberType>){
    const isOutOfRange = !value || ((min !== undefined && value < min) || (max !== undefined && value > max));
    const hasVisibleError = Boolean(error && isOutOfRange);

    return(
        <div className="flex flex-col gap-1">
            <InputNumber id={id} className="input-style" invalid={hasVisibleError} value={value} onChange={onChange} name={name} locale="fr-FR" />
            {
                hasVisibleError && error?
                <span className="error-style block">
                    { error[0] }
                </span> : null
            }
        </div>
    )
}

export default NumberInput