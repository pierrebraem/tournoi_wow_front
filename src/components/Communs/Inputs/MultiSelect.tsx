import { MultiSelect } from "primereact/multiselect";
import type { MultiSelectType } from "../../../types";

function MultiSelectInput({ id, value, onChange, options, name }: Readonly<MultiSelectType>) {
    return(
        <MultiSelect id={id} className="input-style" value={value} onChange={onChange} options={options} optionLabel="name" display="chip" maxSelectedLabels={5} name={name} />
    )
}

export default MultiSelectInput