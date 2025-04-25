import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import useStocks from '@/hooks/useStocks'
import styles from './styles.module.css'
import { X, Pencil } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import { sanitizeNumericInput, isValidNumber } from '@/utils/validation'

const StockCards = () => {
  const { stocks, removeStock, updateAlertPrice } = useStocks()
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }, [])

  if (stocks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No stocks added yet. Use the form to add stocks to track.</p>
      </div>
    )
  }

  const handleEdit = (symbol: string, current: number) => {
    setEditingSymbol(symbol)
    setEditValue(current.toString())
  }

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setEditValue(sanitizeNumericInput({ value }))
  }

  const handleEditBlur = (symbol: string) => {
    if (updateAlertPrice && editValue && isValidNumber({ value: editValue })) {
      const newPrice = parseFloat(editValue)
      updateAlertPrice(symbol, newPrice)
    }
    setEditingSymbol(null)
  }

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      ;(event.target as HTMLInputElement).blur()
    } else if (event.key === 'Escape') {
      setEditingSymbol(null)
    }
  }

  return (
    <div className={styles.cardsContainer}>
      {stocks.map((stock) => {
        const isAboveAlert = stock.currentPrice >= stock.alertPrice
        const cardClass = isAboveAlert ? styles.cardGreen : styles.cardRed

        return (
          <div key={stock.symbol} className={`${styles.card} ${cardClass}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.symbol}>{stock.symbol}</h3>
              <button
                className={styles.removeButton}
                onClick={() => removeStock(stock.symbol)}
                aria-label={`Remove ${stock.symbol}`}
              >
                <X />
              </button>
            </div>

            <div className={styles.price}>
              {formatPrice({ price: stock.currentPrice })}
            </div>

            <div className={styles.details}>
              <div className={styles.change}>
                {stock.percentChange >= 0 ? '▲' : '▼'} {stock.percentChange}%
              </div>

              <div className={styles.alert}>
                Alert:{' '}
                {editingSymbol === stock.symbol ? (
                  <input
                    type='text'
                    value={editValue}
                    onChange={handleEditChange}
                    onBlur={() => handleEditBlur(stock.symbol)}
                    onKeyDown={handleEditKeyDown}
                    autoFocus
                    className={styles.alertInput}
                  />
                ) : (
                  <>
                    {formatPrice({ price: stock.alertPrice })}{' '}
                    <button
                      aria-label={`Edit alert price for ${stock.symbol}`}
                      className={styles.editButton}
                      onClick={() => handleEdit(stock.symbol, stock.alertPrice)}
                    >
                      <Pencil size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StockCards
