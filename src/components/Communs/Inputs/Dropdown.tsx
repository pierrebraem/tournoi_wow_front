import { Dropdown } from "primereact/dropdown";
import type { DropdownType } from "../../../types";

function DropdownInput({ id, value, onChange, options, placeholder, name, error }: Readonly<DropdownType>){
    const hasVisibleError = Boolean(error && (!value || value.label.trim() === ""));

    return(
        <div className="flex flex-col gap-1">
            <Dropdown id={id} className="input-style" invalid={hasVisibleError} value={value} onChange={onChange} options={options} optionLabel="label" placeholder={placeholder} name={name} />
            {
                hasVisibleError && error ?
                <span className="error-style block">
                    { error[0] }
                </span> : null
            }
        </div>
    );
}

export default DropdownInput;