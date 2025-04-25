import { useState } from 'react'
import styles from './styles.module.css'
import 'chartjs-adapter-date-fns'
import useStocks from '@/hooks/useStocks'
import useStockChart from '@/hooks/useStockChart'
import useFilteredStocks, { TIME_RANGES } from '@/hooks/useFilteredStocks'
import BaseButton from '../BaseButton'

const StockChart = () => {
  const { stocks } = useStocks()
  const [range, setRange] = useState(TIME_RANGES[1].value)
  const filteredStocks = useFilteredStocks({ stocks, range })
  const chartRef = useStockChart(filteredStocks)

  if (stocks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Add stocks to see price chart</p>
      </div>
    )
  }

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.chartTitle}>Stock Price History</h2>
      <div className={styles.rangeSelector}>
        {TIME_RANGES.map((opt) => (
          <BaseButton
            key={opt.label}
            onClick={() => setRange(opt.value)}
            className={
              styles.rangeButton +
              (range === opt.value ? ' ' + styles.active : '')
            }
            type='button'
          >
            {opt.label}
          </BaseButton>
        ))}
      </div>
      <div className={styles.chartWrapper}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default StockChart
