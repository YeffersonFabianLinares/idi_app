import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const consultaImagenesSchema = z.object({
    ordinal: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(10, MESSAGES.MAX_LENGTH(10)),
    consecutivo: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(10, MESSAGES.MAX_LENGTH(10)),
});

export type ConsultaImagenesData = z.infer<typeof consultaImagenesSchema>;