const STOCK_LINE_COLORS = [
  '#00C49A',
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#F67019',
  '#C0C0C0',
  '#B2912F'
]

interface GetLineColorForSymbol {
  symbol: string
}

export const getLineColorForSymbol = ({ symbol }: GetLineColorForSymbol) => {
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }
  const idx = Math.abs(hash) % STOCK_LINE_COLORS.length
  return STOCK_LINE_COLORS[idx]
}

interface InvertHexColor {
  hex: string
}

export const invertHexColor = ({ hex }: InvertHexColor) => {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (hex.length !== 6) return '#000000'
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0')
  const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0')
  const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}
