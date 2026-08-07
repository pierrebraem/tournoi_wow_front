import { Dropdown } from "primereact/dropdown";
import type { DropdownType } from "../../../types";

function DropdownInput({ id, value, onChange, options, placeholder, name }: Readonly<DropdownType>){
    return(
        <Dropdown id={id} className="input-style" value={value} onChange={onChange} options={options} optionLabel="label" placeholder={placeholder} name={name} />
    )
}

export default DropdownInput