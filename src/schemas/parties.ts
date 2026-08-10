import * as z from "zod";

const partySchema = z.object({
    name: z.string().min(1, { message: "Ce champ est obligatoire." }),
    characters: z.array(z.object()).min(1, { message: "Vous devez saisir au moins un personnage." }),
});

export { partySchema }