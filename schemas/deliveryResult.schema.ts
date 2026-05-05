import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const DeliveryResultSchema = z.object({
    document: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(40, MESSAGES.MAX_LENGTH(40)),
    type: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
});

export type DeliveryResult = z.infer<typeof DeliveryResultSchema>;