import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const forgotPasswordSchema = z.object({
    tip_doc: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    num_doc: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    fec_nacido: z.date(MESSAGES.DATE_INVALID)
})

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>