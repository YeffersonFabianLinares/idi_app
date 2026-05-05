import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const authSchema = z.object({
    login: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    clave: z.string(MESSAGES.REQUIRED_FIELD),
    tipo: z.string().min(1),
    agree: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD)
})

export type AuthSchema = z.infer<typeof authSchema>