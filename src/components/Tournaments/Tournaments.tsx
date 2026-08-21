import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import AddDialog from "./AddDialog";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { showConfirmDelete } from "../Communs/DeleteDialog";
import ViewDialog from "./ViewDialog";
import { Tournament, Dungeon, Party } from "../../types";
import { getTournaments, deleteTournament, getDungeos, getParties } from "../../utils/api";

function Tournaments(){
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
    const [visibleView, setVisibleView] = useState<boolean>(false);
    const [globalId, setGlobalId] = useState<number | null>(null);
    const [dungeonsOption, setDungeonsOption] = useState<Dungeon[]>([]);
    const [partiesOption, setPartiesOption] = useState<Party[]>([]);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    function dataFromDialog(){
        setRefreshTrigger(prev => prev + 1);
        setVisibleAdd(false);
        setVisibleView(false);
    }

    function confirmDelete(id: number, name: string){
        showConfirmDelete({
            message: "Etes-vous sûr de supprimer le tournoi " + name + " ?",
            header: "Suppression du tournoi " + name,
            accept: async () => {
                await deleteTournament(id);

                setRefreshTrigger(prev => prev + 1);
            }
        });
    }

    function visibleViewIcon(id: number){
        setGlobalId(id);
        setVisibleView(true);
    }

    function bodyIcons(rowData: Tournament){
        return(
            <div className="spacing-between-buttons">
                <Button icon="pi pi-eye" severity="success" onClick={() => visibleViewIcon(rowData.id)} />
                <Button icon="pi pi-pencil" severity="warning" />
                <Button icon="pi pi-trash" severity="danger" onClick={() => confirmDelete(rowData.id, rowData.name)} />
            </div>
        );
    }

    useEffect(() => {
        let ignore = false;
        async function loadData(){
            try{
                const [resTournaments, resDungeos, resParties] = await Promise.all([
                    getTournaments(),
                    getDungeos(),
                    getParties(),
                ]);

                if(!ignore){
                    setTournaments(resTournaments.data);
                    setDungeonsOption(resDungeos.data);
                    setPartiesOption(resParties.data);
                }
            }
            catch(error){
                console.error(error);
            }
        }
        loadData();
        return () => { ignore = true; };
    }, [refreshTrigger]);
    return(
        <>
            <DataTable value={tournaments} className="pb-4">
                <Column field="name" header="Nom" />
                <Column field="start_date" header="Date de début" />
                <Column field="end_date" header="Date de fin" />
                <Column field="description" header="Description" />
                <Column header="Action" body={bodyIcons} />
            </DataTable>

            <AddDialog visible={visibleAdd} sendDataToParent={dataFromDialog} dungeonsOption={dungeonsOption} partiesOption={partiesOption} />
            <ViewDialog visible={visibleView} sendDataToParent={dataFromDialog} id={globalId} partiesOption={partiesOption} />
            <Button label="Ajouter un tournoi" onClick={() => setVisibleAdd(true)} />
        </>
    );
}

export default Tournaments;