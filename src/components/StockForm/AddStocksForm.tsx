import { ChangeEvent, FormEvent, useState } from 'react'
import BaseButton from '../BaseButton'
import styles from './styles.module.css'

interface AddStocksFormProps {
  alertPrice: string
  handleAlertPriceChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: FormEvent) => void
  isLoading: boolean
  selectedSymbol: string
  setSelectedSymbol: (value: string) => void
  symbols: Array<{ description: string; symbol: string }>
}

const AddStocksForm = ({
  alertPrice,
  handleAlertPriceChange,
  handleSubmit,
  isLoading,
  selectedSymbol,
  setSelectedSymbol,
  symbols
}: AddStocksFormProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSymbols = symbols.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor='stockSearch'>Search Stock:</label>
        <input
          className={styles.input}
          id='stockSearch'
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search by symbol or description'
          type='text'
          value={searchTerm}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='stockSymbol'>Stock Symbol:</label>
        <select
          className={styles.select}
          disabled={isLoading}
          id='stockSymbol'
          onChange={(e) => setSelectedSymbol(e.target.value)}
          value={selectedSymbol}
        >
          <option value=''>Select a stock</option>
          {filteredSymbols.slice(0, 100).map((stock) => (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - {stock.description}
            </option>
          ))}
        </select>
        {isLoading && <p className={styles.loading}>Loading symbols...</p>}
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='alertPrice'>Price Alert ($):</label>
        <input
          className={styles.input}
          id='alertPrice'
          onChange={handleAlertPriceChange}
          placeholder='Enter alert price'
          type='text'
          value={alertPrice}
        />
      </div>
      <BaseButton
        className={styles.button}
        disabled={isLoading || !selectedSymbol || !alertPrice}
        type='submit'
      >
        Add Stock
      </BaseButton>
    </form>
  )
}

export default AddStocksForm
