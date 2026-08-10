import * as z from "zod";

const requiredField = "Ce champ est obligatoire.";
const ilvlField = "Votre saisie doit être comprise entre 0 et 645.";
const rioField = "Votre saisie doit être comprise entre 0 et 4500."

const characterSchema = z.object({
    name: z.string().min(1, { message: requiredField }),
    class_id: z.number().positive({ message: requiredField }),
    role_id: z.number().positive({ message: requiredField }),
    ilvl: z.number().min(0, { message: ilvlField }).max(645, { message: ilvlField }),
    rio: z.number().min(0, { message: rioField }).max(4500, { message: rioField }),
});

export { characterSchema }