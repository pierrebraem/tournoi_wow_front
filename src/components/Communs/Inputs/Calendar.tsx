import { Calendar } from 'primereact/calendar';
import type { CalendarType } from '../../../types/communs';

function CalendarInput({ id, value, onChange, name }: Readonly<CalendarType>){
    return(
        <Calendar id={id} className="input-style" value={value} onChange={onChange} name={name} locale="fr-FR" dateFormat="dd/mm/yy" />
    )
}

export default CalendarInput