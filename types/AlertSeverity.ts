/**
 * @module Types/AlertSeverity
 */

/**
 * Define los niveles de severidad permitidos para las alertas del sistema.
 * 
 * Este tipo se utiliza para determinar el color, el icono y la intención 
 * comunicativa de los componentes de notificación.
 * 
 * - `success`: Operaciones exitosas (ej: especialista guardado).
 * - `error`: Fallos críticos o de validación (ej: error en API).
 * - `info`: Mensajes informativos o de estado.
 * - `warning`: Advertencias que no bloquean el flujo (ej: sesión por expirar).
 * 
 * @category Types
 * @example
 * ```tsx
 * const severity: AlertSeverity = 'success';
 * ```
 */

export type AlertSeverity = 'success' | 'error' | 'info' | 'warning';