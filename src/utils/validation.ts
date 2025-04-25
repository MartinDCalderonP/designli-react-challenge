interface SanitizeNumericInputParams {
  value: string
}
export const sanitizeNumericInput = ({ value }: SanitizeNumericInputParams) => {
  return value.replace(/[^0-9.]/g, '')
}

interface IsValidNumberParams {
  value: string
}

export const isValidNumber = ({ value }: IsValidNumberParams) => {
  const num = Number.parseFloat(value)
  return !isNaN(num)
}
