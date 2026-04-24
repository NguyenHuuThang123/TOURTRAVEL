export const VIETNAM_TIMEZONE = 'Asia/Ho_Chi_Minh'

function buildOptions(options = {}) {
  return {
    timeZone: VIETNAM_TIMEZONE,
    ...options
  }
}

export function formatVietnamDate(value, locale = 'vi-VN', options = {}) {
  if (!value) return ''
  return new Date(value).toLocaleDateString(locale, buildOptions(options))
}

export function formatVietnamTime(value, locale = 'vi-VN', options = {}) {
  if (!value) return ''
  return new Date(value).toLocaleTimeString(locale, buildOptions(options))
}

export function formatVietnamDateTime(value, locale = 'vi-VN', options = {}) {
  if (!value) return ''
  return new Date(value).toLocaleString(locale, buildOptions(options))
}

export function formatVietnamDateRange(start, end, locale = 'vi-VN') {
  if (!start && !end) return ''
  if (!start) return formatVietnamDate(end, locale)
  if (!end) return formatVietnamDate(start, locale)
  return `${formatVietnamDate(start, locale)} - ${formatVietnamDate(end, locale)}`
}
