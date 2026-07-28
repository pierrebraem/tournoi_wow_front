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
            icon: 'pi pi-crown',
            url: '/tournaments'
        }
    ]

    return(
        <Menubar model={items} className="mb-4" />
    )
}

export default Header