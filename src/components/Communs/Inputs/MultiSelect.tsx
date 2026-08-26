import { MultiSelect } from "primereact/multiselect";
import type { MultiSelectType } from "../../../types";

function MultiSelectInput({ id, value, onChange, options, name, error, min, max }: Readonly<MultiSelectType>) {
    const hasVisibleError = Boolean(error && (!value || value.length < (min ?? 1) || (max !== undefined && value.length > max)));

    return(
        <div className="flex flex-col gap-1">
            <MultiSelect id={id} className="input-style" invalid={hasVisibleError} value={value} onChange={onChange} options={options} optionLabel="name" display="chip" maxSelectedLabels={5} name={name} />
            {
                hasVisibleError && error ?
                <span className="error-style block">
                    { error[0] }
                </span> : null
            }
        </div>
    );
}

export default MultiSelectInput;