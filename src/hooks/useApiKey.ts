import { createContext, useContext } from 'react'

interface UseApiKeyResult {
  apiKey: string | null
  clearApiKey: () => void
  setApiKey: (key: string) => void
}

export const ApiKeyContext = createContext<UseApiKeyResult | undefined>(
  undefined
)

const useApiKey = () => {
  const context = useContext(ApiKeyContext)

  if (!context) throw new Error('useApiKey must be used within ApiKeyProvider')

  return context
}

export default useApiKey
