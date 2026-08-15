import { Calendar } from 'primereact/calendar';
import type { CalendarType } from '../../../types';

function CalendarInput({ id, value, onChange, name, error }: Readonly<CalendarType>){
    const hasVisibleError = Boolean(error);

    return(
        <div className="flex flex-col gap-1">
            <Calendar id={id} className="input-style" invalid={hasVisibleError} value={value} onChange={onChange} name={name} locale="fr-FR" dateFormat="dd/mm/yy" />
            {
                hasVisibleError && error ?
                <span className="error-style block">
                    { error[0] }
                </span> : null
            }
        </div>
    );
}

export default CalendarInput;