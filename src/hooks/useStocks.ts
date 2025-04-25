import { createContext, useContext } from 'react'
import type { StockData, AddStockParams } from '@/types'

interface UseStocksResult {
  addStock: (params: AddStockParams) => void
  removeStock: (symbol: string) => void
  stocks: StockData[]
  updateAlertPrice: (symbol: string, newPrice: number) => void
}

export const StockContext = createContext<UseStocksResult | undefined>(
  undefined
)

const useStocks = () => {
  const ctx = useContext(StockContext)

  if (!ctx) throw new Error('useStocks must be used within a StockProvider')

  return ctx
}

export default useStocks
