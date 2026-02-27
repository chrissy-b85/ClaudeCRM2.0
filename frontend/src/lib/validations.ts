/** Validates an NDIS number: exactly 9 digits */
export function validateNDISNumber(value: string): boolean {
  return /^\d{9}$/.test(value)
}

/** Validates an Australian phone number (mobile 04xx or landline 0x xxxx) */
export function validateAustralianPhone(value: string): boolean {
  const cleaned = value.replace(/\s/g, '')
  return /^(04\d{8}|0[2-9]\d{8})$/.test(cleaned)
}

/** Validates an email address */
export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Returns true if the given date is in the past */
export function isPastDate(date: Date): boolean {
  return date < new Date()
}

/** Formats a date string as dd Mon yyyy (Australian style) */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Formats a datetime string as dd Mon yyyy HH:mm */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Formats a number as AUD currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount)
}

/** Returns the number of days until a target date (negative if past) */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/** Calculates the percentage of a plan period elapsed */
export function planElapsedPercent(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = Date.now()
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now - start) / (end - start)) * 100)
}
