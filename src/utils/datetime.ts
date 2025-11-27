import { appConfig } from '@/core/config/app-config'

const locale = 'es-CO'

// IMPORTANTE: Forzamos la zona horaria de la clínica como la Única Fuente de Verdad (SSOT).
// Si no está definida en la config, usamos 'America/Bogota' por defecto.
// Esto evita que el navegador use la hora local del usuario (ej: UTC o España) al visualizar.
const CLINIC_TIMEZONE = appConfig.timeZone || 'America/Bogota'

/**
 * Formatea una fecha ISO (ej: 2023-11-27T15:00:00Z) para mostrarla al usuario
 * en la zona horaria de la clínica.
 */
export const formatDateTime = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!isoString) return '—'

  try {
    // Aseguramos que tratamos con un objeto Date válido
    const date = new Date(isoString)

    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: CLINIC_TIMEZONE, // <--- Clave: Muestra la hora de la clínica, no la del navegador
      hour12: true, // Preferencia usual en LatAm (02:00 p.m.)
      ...options,
    }).format(date)
  } catch (error) {
    console.error('No se pudo formatear la fecha', error)
    return isoString
  }
}

/**
 * NUEVA FUNCIÓN CRÍTICA:
 * Construye un ISO String forzando la zona horaria de Colombia (-05:00).
 * * Por qué es necesaria:
 * Si usas "new Date()", el navegador usa su zona horaria local. 
 * Si un usuario selecciona "08:00 AM" pero su PC está en otra zona, podría enviar "13:00 UTC" 
 * que el backend interpretaría incorrectamente como "01:00 PM" o como una fecha pasada.
 * * Esta función anula la interpretación del navegador y envía el dato crudo con el offset fijo.
 * * @param dateStr Formato YYYY-MM-DD
 * @param timeStr Formato HH:mm
 */
export const buildClinicISOString = (dateStr: string, timeStr: string): string => {
  // Validación defensiva básica
  if (!dateStr || !timeStr) return '';

  // Aseguramos que la hora tenga segundos para cumplir formato ISO estricto
  const time = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  
  // Construimos el ISO con el offset explícito de Colombia (-05:00)
  // Ejemplo resultante: "2023-11-27T15:00:00-05:00"
  // Django Rest Framework entenderá esto inequívocamente como "3 PM hora Colombia"
  return `${dateStr}T${time}-05:00`;
}