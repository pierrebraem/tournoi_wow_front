import { InputText } from "primereact/inputtext";
import type { TextType } from "../../../types/communs";

function TextInput({ id, value, onChange, name}: Readonly<TextType>) {
    return(
        <InputText id={id} className="input-style" value={value} onChange={onChange} name={name} />
    )

}

export default TextInput 