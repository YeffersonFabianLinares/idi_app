import { MESSAGES } from "@/constants/messages";
import z from "zod";

export const appoinmentSchema = z.object({
    id_menbot: z.any().optional(),
    // step one
    cod_area: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    origen: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    tip_doc: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    num_doc: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    //step two
    pri_nombre: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)),
    seg_nombre: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)).nullable(),
    pri_apellido: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)),
    seg_apellido: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)).nullable(),
    sexo: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(1, MESSAGES.MAX_LENGTH(1)),
    fec_nacido: z.date(MESSAGES.DATE_INVALID),
    telefono_o: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)),
    telefono_c: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD).max(30, MESSAGES.MAX_LENGTH(30)),
    email: z.email(MESSAGES.INVALID_EMAIL).min(1, MESSAGES.INVALID_EMAIL).max(100, MESSAGES.MAX_LENGTH(100)),
    auth_data: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    //step three
    cod_depto: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    cod_empresa: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    busExam: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    cod_examen: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    // step four
    busqueda: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    hora_dispo: z.string(MESSAGES.REQUIRED_FIELD).min(1, MESSAGES.REQUIRED_FIELD),
    sede_dispo: z.string(MESSAGES.REQUIRED_FIELD).optional().nullable(),
    fec_dispo: z.date(MESSAGES.DATE_INVALID).optional().nullable(),
    acepta_id: z.any().nullable(),
    post_mortem: z.string(MESSAGES.REQUIRED_FIELD).nullable().optional()
}).superRefine((values, ctx) => {
    // Validación para sede_dispo (Si busqueda es '2' o '4')
    if (['2', '4'].includes(values.busqueda)) {
        if (!values.sede_dispo || values.sede_dispo.trim() === '' || values.sede_dispo === null || values.sede_dispo === undefined) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: MESSAGES.REQUIRED_FIELD,
                path: ['sede_dispo'],
            });
        }
    }
    // Validación para fec_dispo (Si busqueda es '3' o '4')
    if (['3', '4'].includes(values.busqueda)) {
        if (!values.fec_dispo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: MESSAGES.REQUIRED_FIELD,
                path: ['fec_dispo'],
            });
        }
    }
})

export type IAppoinment = z.infer<typeof appoinmentSchema>;