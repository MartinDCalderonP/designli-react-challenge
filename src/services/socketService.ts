type AlertLevels = Record<string, number>

type TradeData = {
  s: string
  p: number
  t: number
}

class SocketService {
  private socket: WebSocket | null = null
  private readonly subscribedSymbols: Set<string> = new Set()
  private alertLevels: AlertLevels = {}
  private readonly listeners: ((
    symbol: string,
    price: number,
    timestamp: number
  ) => void)[] = []
  private lastLocalStorageUpdate: Record<string, number> = {}
  private readonly LOCAL_STORAGE_THROTTLE_MS = 2000
  private lastPrice: Record<string, number> = {}
  private readonly connectionListeners: ((isConnected: boolean) => void)[] = []
  private isConnected = false

  constructor() {
    this.onMessage = this.onMessage.bind(this)
  }

  connect() {
    let apiKey = localStorage.getItem('finnhubApiKey') ?? ''

    if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
      apiKey = apiKey.slice(1, -1)
    }

    if (!apiKey) return

    const url = `wss://ws.finnhub.io?token=${apiKey}`

    if (this.socket) return

    this.socket = new WebSocket(url)
    this.socket.addEventListener('open', () => {
      this.isConnected = true
      this.notifyConnectionListeners(true)
      this.subscribedSymbols.forEach((symbol: string) => {
        this.subscribe(symbol)
      })
    })
    this.socket.addEventListener('close', () => {
      this.isConnected = false
      this.notifyConnectionListeners(false)
    })
    this.socket.addEventListener('error', () => {
      this.isConnected = false
      this.notifyConnectionListeners(false)
    })
    this.socket.addEventListener('message', this.onMessage)
  }

  subscribe(symbol: string) {
    this.subscribedSymbols.add(symbol)
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'subscribe', symbol }))
    }
  }

  unsubscribe(symbol: string) {
    this.subscribedSymbols.delete(symbol)
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
    }
  }

  setAlert(symbol: string, price: number) {
    this.alertLevels[symbol] = price
  }

  onPriceUpdate(
    listener: (symbol: string, price: number, timestamp: number) => void
  ) {
    this.listeners.push(listener)
  }

  private notifyListeners(symbol: string, price: number, timestamp: number) {
    this.listeners.forEach((listener) => listener(symbol, price, timestamp))
  }

  onMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)
      if (data.type === 'trade' && data.data) {
        ;(data.data as TradeData[]).forEach((trade: TradeData) => {
          const { s: symbol, p: price, t: timestamp } = trade

          const now = Date.now()
          if (
            !this.lastLocalStorageUpdate[symbol] ||
            now - this.lastLocalStorageUpdate[symbol] >
              this.LOCAL_STORAGE_THROTTLE_MS
          ) {
            const key = `stock_${symbol}`
            let prev: { price: number; timestamp: number }[] = []
            try {
              prev = JSON.parse(localStorage.getItem(key) ?? '[]')
            } catch (err) {
              console.warn('Error parsing localStorage for', key, err)
            }
            prev.push({ price, timestamp })

            localStorage.setItem(key, JSON.stringify(prev.slice(-500)))
            this.lastLocalStorageUpdate[symbol] = now
          }

          this.notifyListeners(symbol, price, timestamp)

          const alertLevel = this.alertLevels[symbol]
          const last = this.lastPrice[symbol]
          if (
            alertLevel !== undefined &&
            last !== undefined &&
            last >= alertLevel &&
            price < alertLevel
          ) {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
              navigator.serviceWorker.ready.then((reg) => {
                if (reg.active) {
                  reg.active.postMessage({
                    type: 'PRICE_ALERT',
                    symbol,
                    price,
                    alert: alertLevel
                  })
                }
              })
            }
          }
          this.lastPrice[symbol] = price
        })
      }
    } catch (e) {
      console.error('Error handling WebSocket message', e)
    }
  }

  getIsConnected() {
    return this.isConnected
  }

  onConnectionChange(listener: (isConnected: boolean) => void) {
    this.connectionListeners.push(listener)
  }

  private notifyConnectionListeners(isConnected: boolean) {
    this.connectionListeners.forEach((listener) => listener(isConnected))
  }
}

const socketService = new SocketService()
export default socketService
