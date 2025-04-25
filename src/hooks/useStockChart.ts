import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import type { StockData } from '@/types'
import { getLineColorForSymbol, invertHexColor } from '@/utils/color'

const useStockChart = (stocks: StockData[]) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const initializeChart = () => {
    if (!chartRef.current || chartInstance.current) return

    const ctx = chartRef.current.getContext('2d')
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: []
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: false,
                tooltipFormat: 'HH:mm:ss',
                displayFormats: {
                  second: 'HH:mm:ss',
                  minute: 'HH:mm',
                  hour: 'HH:mm'
                }
              },
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price ($)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      })
    }
  }

  useEffect(() => {
    if (stocks.length === 0 && chartInstance.current) {
      chartInstance.current.destroy()
      chartInstance.current = null
      return
    }

    if (!chartInstance.current && stocks.length > 0) {
      if (chartRef.current) {
        initializeChart()
      } else {
        setTimeout(() => {
          if (!chartInstance.current && chartRef.current) {
            initializeChart()
          }
        }, 0)
      }
    }
  }, [stocks.length])

  useEffect(() => {
    if (!chartInstance.current) return
    const chart = chartInstance.current

    const symbolToIndex: Record<string, number> = {}
    ;(chart.data.datasets as { label: string }[]).forEach((ds, idx: number) => {
      symbolToIndex[ds.label] = idx
    })

    stocks.forEach((stock) => {
      const data = stock.priceHistory
        .slice()
        .sort((a, b) => a.time - b.time)
        .map((point) => ({
          x: point.time > 1e12 ? point.time : point.time * 1000,
          y: point.price
        }))
      const lineColor = getLineColorForSymbol({ symbol: stock.symbol })
      const pointColor = invertHexColor({ hex: lineColor })
      if (symbolToIndex[stock.symbol] !== undefined) {
        const idx = symbolToIndex[stock.symbol]
        chart.data.datasets[idx].data = data
        chart.data.datasets[idx].borderColor = lineColor
        chart.data.datasets[idx].backgroundColor = pointColor
      } else {
        chart.data.datasets.push({
          label: stock.symbol,
          data,
          borderColor: lineColor,
          backgroundColor: pointColor,
          tension: 0.2,
          pointRadius: 2,
          pointHoverRadius: 5
        })
      }
    })
    chart.data.datasets = chart.data.datasets.filter((ds) =>
      stocks.some((stock) => stock.symbol === (ds as { label: string }).label)
    )
    chart.update('none')
  }, [stocks])

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
        chartInstance.current = null
      }
    }
  }, [])

  return chartRef
}

export default useStockChart
