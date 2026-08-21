const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getDungeos(){
    const res = await fetch(`${expressUrl}/dungeos`);
    const dungeos = await res.json();
    const status = res.status;
    return { status, data: dungeos };
}