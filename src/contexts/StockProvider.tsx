import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import useLocalStorage from '@/hooks/useLocalStorage'
import type { StockData, AddStockParams } from '@/types'
import socketService from '@/services/socketService'
import { StockContext } from '@/hooks/useStocks'

const mapPriceHistory = (
  arr: { price: number; timestamp: number }[]
): { time: number; price: number }[] => {
  return arr.map((p) => ({ time: p.timestamp, price: p.price }))
}

const updateStockWithHistory = (
  stock: StockData,
  history: { price: number; timestamp: number }[]
): StockData => {
  if (!history || history.length === 0) return stock
  const last = history[history.length - 1]
  const previousPrice = stock.currentPrice
  const currentPrice = last.price
  const percentChange = previousPrice
    ? +(((currentPrice - previousPrice) / previousPrice) * 100).toFixed(2)
    : 0
  return {
    ...stock,
    currentPrice,
    previousPrice,
    percentChange,
    priceHistory: mapPriceHistory(history),
    timestamp: last.timestamp
  }
}

interface StockProviderProps {
  children: ReactNode
}

const StockProvider = ({ children }: StockProviderProps) => {
  const [stocks, setStocks] = useLocalStorage<StockData[]>({
    key: 'stocks',
    initialValue: []
  })

  const addStock = useCallback(
    ({ alertPrice, symbol }: AddStockParams) => {
      setStocks((prevStocks) => {
        if (prevStocks.some((stock) => stock.symbol === symbol))
          return prevStocks
        socketService.subscribe(symbol)
        socketService.setAlert(symbol, alertPrice)
        const key = `stock_${symbol}`
        const priceHistory = JSON.parse(localStorage.getItem(key) ?? '[]') as {
          price: number
          timestamp: number
        }[]
        const last = priceHistory[priceHistory.length - 1]
        const newStock: StockData = {
          symbol,
          alertPrice,
          currentPrice: last ? last.price : 0,
          previousPrice: 0,
          percentChange: 0,
          priceHistory:
            priceHistory.length > 0 ? mapPriceHistory(priceHistory) : [],
          timestamp: last ? last.timestamp : Date.now(),
          notified: false
        }
        return [...prevStocks, newStock]
      })
    },
    [setStocks]
  )

  const removeStock = useCallback(
    (symbol: string) => {
      setStocks((prevStocks) => {
        socketService.unsubscribe(symbol)
        return prevStocks.filter((stock) => stock.symbol !== symbol)
      })
    },
    [setStocks]
  )

  const updateAlertPrice = useCallback(
    (symbol: string, newPrice: number) => {
      setStocks((prevStocks) => {
        socketService.setAlert(symbol, newPrice)
        return prevStocks.map((stock) =>
          stock.symbol === symbol ? { ...stock, alertPrice: newPrice } : stock
        )
      })
    },
    [setStocks]
  )

  const handlePriceUpdateMap = (
    symbol: string,
    history: { price: number; timestamp: number }[],
    stocks: StockData[]
  ) =>
    stocks.map((stock) =>
      stock.symbol === symbol ? updateStockWithHistory(stock, history) : stock
    )

  useEffect(() => {
    socketService.connect()

    const handlePriceUpdate = (symbol: string) => {
      setStocks((prevStocks) => {
        const key = `stock_${symbol}`
        const newHistory = JSON.parse(localStorage.getItem(key) ?? '[]') as {
          price: number
          timestamp: number
        }[]
        if (!newHistory || newHistory.length === 0) return prevStocks
        return handlePriceUpdateMap(symbol, newHistory, prevStocks)
      })
    }
    socketService.onPriceUpdate(handlePriceUpdate)
  }, [setStocks])

  useEffect(() => {
    socketService.connect()
    stocks.forEach((stock) => {
      socketService.subscribe(stock.symbol)
      socketService.setAlert(stock.symbol, stock.alertPrice)
    })
  }, [stocks])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.startsWith('stock_')) {
        setStocks((prevStocks) => {
          const priceHistory = JSON.parse(event.newValue ?? '[]') as {
            price: number
            timestamp: number
          }[]
          if (!priceHistory || priceHistory.length === 0) return prevStocks
          const symbol = event.key!.replace('stock_', '')
          return handlePriceUpdateMap(symbol, priceHistory, prevStocks)
        })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [setStocks])

  const value = useMemo(
    () => ({ stocks, addStock, removeStock, updateAlertPrice }),
    [stocks, addStock, removeStock, updateAlertPrice]
  )

  return <StockContext.Provider value={value}>{children}</StockContext.Provider>
}

export default StockProvider
