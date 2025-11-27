import { appConfig } from '@/core/config/app-config'

const locale = 'es-CO'

// IMPORTANTE: Forzamos la zona horaria de la clínica.
// Si appConfig no la tiene, usamos 'America/Bogota' como fallback fijo en vez de la del navegador.
const CLINIC_TIMEZONE = appConfig.timeZone || 'America/Bogota'

export const formatDateTime = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!isoString) return '—'

  try {
    // Si la fecha viene sin 'Z' (UTC) del backend, JS asume hora local y causa errores.
    // Aseguramos que tratamos con un objeto Date válido.
    const date = new Date(isoString)

    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: CLINIC_TIMEZONE, // <--- Aquí está la magia
      hour12: true, // Preferencia usual en LatAm (02:00 p.m.)
      ...options,
    }).format(date)
  } catch (error) {
    console.error('No se pudo formatear la fecha', error)
    return isoString
  }
}

// Helper nuevo para enviar fechas al backend correctamente
export const formatForBackend = (date: Date): string => {
    // Retorna ISO string completo preservando el instante UTC correcto
    return date.toISOString();
}

