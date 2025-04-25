import { ReactNode, useCallback, useMemo } from 'react'
import { ApiKeyContext } from '@/hooks/useApiKey'
import useLocalStorage from '@/hooks/useLocalStorage'

interface ApiKeyProviderProps {
  children: ReactNode
}

const ApiKeyProvider = ({ children }: ApiKeyProviderProps) => {
  const [apiKey, setStoredApiKey] = useLocalStorage<string>({
    key: 'finnhubApiKey',
    initialValue: ''
  })

  const setApiKey = useCallback(
    (key: string) => setStoredApiKey(key),
    [setStoredApiKey]
  )
  const clearApiKey = useCallback(() => setStoredApiKey(''), [setStoredApiKey])

  const value = useMemo(
    () => ({ apiKey, setApiKey, clearApiKey }),
    [apiKey, setApiKey, clearApiKey]
  )

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  )
}

export default ApiKeyProvider
