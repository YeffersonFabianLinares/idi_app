import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const resetPasswordSchema = z.object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
        .regex(/[a-z]/, 'Debe incluir al menos una minúscula'),
    confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
    ordinal: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>