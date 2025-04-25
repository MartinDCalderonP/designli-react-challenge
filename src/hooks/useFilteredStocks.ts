import { useMemo } from 'react'
import type { StockData } from '@/types'

interface UseFilteredStocksParams {
  stocks: StockData[]
  range: number | null
}

const useFilteredStocks = ({ stocks, range }: UseFilteredStocksParams) => {
  return useMemo(() => {
    if (!range) return stocks

    const now = Date.now()

    return stocks.map((stock) => ({
      ...stock,
      priceHistory: stock.priceHistory.filter(
        (priceEntry) => now - priceEntry.time <= range
      )
    }))
  }, [stocks, range])
}

export const TIME_RANGES = [
  { label: '1h', value: 60 * 60 * 1000 },
  { label: '1d', value: 24 * 60 * 60 * 1000 },
  { label: '1w', value: 7 * 24 * 60 * 60 * 1000 },
  { label: '1m', value: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All', value: null }
]

export type TimeRangeOption = (typeof TIME_RANGES)[number]

export default useFilteredStocks
