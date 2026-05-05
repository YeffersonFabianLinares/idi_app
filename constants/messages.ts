export const MESSAGES = {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Por favor, introduce un correo válido',
    PASSWORD_MIN_LENGTH: (min: number) => `La contraseña debe tener al menos ${min} caracteres`,
    EMAIL_MIN_LENGTH: (min: number) => `El correo debe tener al menos ${min} caracteres`,
    MIN_LENGTH: (min: number) => `El campo debe tener al menos ${min} caracteres`,
    MAX_LENGTH: (max: number) => `El campo debe tener máximo ${max} caracteres`,
    MAX_SIZE: (mb: number) => `El tamaño máximo es de ${mb}MB.`,
    URL_VALID: "Debe ser una URL válida",
    DATE_INVALID: "Debe ser una fecha valida"
};