const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getDungeos(){
    const res = await fetch(`${expressUrl}/dungeos`);
    const json = await res.json();
    const status = res.status;

    if (status != 200){
        return { status, message: json.message };
    }

    return { status, data: json };
}