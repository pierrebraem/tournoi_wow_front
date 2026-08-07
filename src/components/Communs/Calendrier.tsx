import { Calendar } from 'primereact/calendar';
import type { CalendrierType } from '../../types/communs';

function Calendrier({ id, value, onChange, name }: Readonly<CalendrierType>){
    return(
        <Calendar id={id} className="input-style" value={value} onChange={onChange} name={name} locale="fr-FR" dateFormat="dd/mm/yy" />
    )
}

export default Calendrier