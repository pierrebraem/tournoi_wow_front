const expressUrl = import.meta.env.VITE_EXPRESS_URL;

export async function getRoles(idClass: number){
    const res = await fetch(`${expressUrl}/canbe/class/${idClass}`);
    const roles = await res.json();
    const status = res.status;
    return { status, data: roles };
}