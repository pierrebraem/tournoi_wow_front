import { Menubar } from "primereact/menubar";

function Header(){
    const items = [
        {
            label: 'Accueil',
            icon: 'pi pi-home',
            url: '/'
        },
        {
            label: 'Gestion de personnages',
            icon: 'pi pi-user',
            url: '/characters'
        },
        {
            label: 'Gestion d\'équipes',
            icon: 'pi pi-users',
            url: '/parties'
        },
        {
            label: 'Gestion des tournois',
            url: '/tournaments'
        }
    ]

    return(
        <>
            <Menubar model={items} />
        </>
    )
}

export default Header