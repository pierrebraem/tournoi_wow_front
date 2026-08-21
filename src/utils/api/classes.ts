const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getClasses(){
    const res = await fetch(`${expressUrl}/class`);
    const classes = await res.json();
    const status = res.status;
    return { status, data: classes };
}