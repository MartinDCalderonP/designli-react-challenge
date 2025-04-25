import { useCallback, useState } from 'react'
import type { StockSymbol } from '@/types'
import useApiKey from './useApiKey'

const updateServiceWorkerApiKey = (apiKey: string) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'set-api-key',
      payload: { apiKey }
    })
  }
}

interface UseFetchSymbolsProps {
  apiKey: string
}

interface UseFetchSymbolsResult {
  error: string
  fetchSymbols: () => Promise<void>
  isLoading: boolean
  symbols: StockSymbol[]
}

const useFetchSymbols = ({
  apiKey
}: UseFetchSymbolsProps): UseFetchSymbolsResult => {
  const [symbols, setSymbols] = useState<StockSymbol[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { clearApiKey } = useApiKey()

  const fetchSymbols = useCallback(async () => {
    if (!apiKey) {
      setError('API Key is required.')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(
        `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`
      )

      if (response.status === 401) {
        clearApiKey()
        setError('The API Key is invalid, please check your API Key.')
        throw new Error('Invalid API Key, please check your API Key.')
      }
      updateServiceWorkerApiKey(apiKey)
      if (!response.ok) {
        setError('Failed to fetch symbols, please try again later.')
        throw new Error('Failed to fetch symbols, please try again later.')
      }
      const data = await response.json()
      setSymbols(data)
    } catch (error) {
      console.error('Error fetching symbols:', error)
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, clearApiKey])

  return {
    symbols,
    isLoading,
    error,
    fetchSymbols
  }
}

export default useFetchSymbols
