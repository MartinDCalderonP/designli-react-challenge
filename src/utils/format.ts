interface FormatPriceParams {
  price: number
  currency?: string
}

export const formatPrice = ({ price, currency = '$' }: FormatPriceParams) => {
  return `${currency}${price.toFixed(2)}`
}
