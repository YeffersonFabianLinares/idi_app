import z from "zod";

export const formSpeciality = z.object({
    name: z.string()
})

export type FormSpeciality = z.infer<typeof formSpeciality>