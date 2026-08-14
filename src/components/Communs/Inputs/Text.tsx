import { InputText } from "primereact/inputtext";
import type { TextType } from "../../../types";

function TextInput({ id, value, onChange, name, error}: Readonly<TextType>) {
    const hasVisibleError = Boolean(error && (!value || value.trim() === ""));

    return(
        <div className="flex flex-col gap-1">
            <InputText id={id} className="input-style" invalid={hasVisibleError} value={value} onChange={onChange} name={name} />
            {
                hasVisibleError && error ? 
                <span className="error-style block">
                    { error[0] }
                </span> : null
            }
        </div>
    )

}

export default TextInput 