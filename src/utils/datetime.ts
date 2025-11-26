import { appConfig } from '@/core/config/app-config'

const locale = 'es-CO'
const defaultTimeZone = appConfig.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone

export const formatDateTime = (isoString: string, options?: Intl.DateTimeFormatOptions) => {
  if (!isoString) return '—'

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: defaultTimeZone,
      ...options,
    }).format(new Date(isoString))
  } catch (error) {
    console.error('No se pudo formatear la fecha', error)
    return isoString
  }
}

