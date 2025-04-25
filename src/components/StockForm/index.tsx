import { ChangeEvent, FormEvent, useState, useEffect } from 'react'
import styles from './styles.module.css'
import AddStocksForm from './AddStocksForm'
import ApiKeyForm from './ApiKeyForm'
import useApiKey from '@/hooks/useApiKey'
import useFetchSymbols from '@/hooks/useFetchSymbols'
import useStocks from '@/hooks/useStocks'
import BaseButton from '../BaseButton'
import { sanitizeNumericInput, isValidNumber } from '@/utils/validation'

const StockForm = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('')
  const [alertPrice, setAlertPrice] = useState('')
  const [inputApiKey, setInputApiKey] = useState('')
  const { apiKey, setApiKey, clearApiKey } = useApiKey()
  const { error, isLoading, fetchSymbols, symbols } = useFetchSymbols({
    apiKey: apiKey ?? inputApiKey
  })
  const { addStock } = useStocks()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (!selectedSymbol || !alertPrice) {
      alert('Please select a stock and enter an alert price')
      return
    }

    const alertPriceNum = Number.parseFloat(alertPrice)

    if (!isValidNumber({ value: alertPrice })) {
      alert('Please enter a valid number for alert price')
      return
    }

    addStock({ alertPrice: alertPriceNum, symbol: selectedSymbol })
    setSelectedSymbol('')
    setAlertPrice('')
  }

  const handleAlertPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const numericValue = sanitizeNumericInput({ value })
    setAlertPrice(numericValue)
  }

  const handleConfirmApiKey = async (key: string) => {
    setApiKey(key)
    await fetchSymbols()
  }

  useEffect(() => {
    if (apiKey && symbols.length === 0 && !isLoading) {
      fetchSymbols()
    }
  }, [apiKey, fetchSymbols, isLoading, symbols.length])

  return (
    <div className={styles.formContainer}>
      <h2>{apiKey ? 'Add Stock to Track' : 'Add API Key'}</h2>
      {!apiKey ? (
        <ApiKeyForm
          error={error}
          fetchSymbols={handleConfirmApiKey}
          inputApiKey={inputApiKey}
          isLoading={isLoading}
          setInputApiKey={setInputApiKey}
        />
      ) : (
        <>
          <AddStocksForm
            alertPrice={alertPrice}
            handleAlertPriceChange={handleAlertPriceChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            symbols={symbols}
          />
          <BaseButton
            className={styles.clearApiKeyButton}
            onClick={clearApiKey}
          >
            Clear API Key
          </BaseButton>
        </>
      )}
    </div>
  )
}

export default StockForm
