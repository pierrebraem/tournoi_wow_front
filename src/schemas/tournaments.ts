import * as z from "zod";

const requiredField = "Ce champ est obligatoire.";

const tournamentSchema = z.object({
    name: z.string().min(1, { message: requiredField }),
    start_date: z.date({ message: requiredField }),
    end_date: z.date({ message: requiredField }),
    participation_right: z.number({ message: requiredField }).positive({ message: "Votre saisie doit être positive." }),
    description: z.string().min(1, { message: requiredField }),
    dungeons: z.array(z.object()).min(1, { message: "Vous devez saisir au moins un donjon." }),
    parties: z.array(z.object()).min(2, { message: "Vous devez saisir au moins deux équipes." }),
}).superRefine((val, ctx) => {
    if(val.end_date < val.start_date){
        ctx.addIssue({
            code: "custom",
            message: "La date de fin doit être supérieure à la date de début",
            path: ["end_date"],
        });
    }
});

export { tournamentSchema };