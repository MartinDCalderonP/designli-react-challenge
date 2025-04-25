interface PriceHistory {
  time: number
  price: number
}

export interface StockData {
  alertPrice: number
  currentPrice: number
  notified: boolean
  percentChange: number
  previousPrice: number
  priceHistory: PriceHistory[]
  symbol: string
  timestamp: number
}

export interface StockSymbol {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

export interface AddStockParams {
  alertPrice: number
  symbol: string
}
