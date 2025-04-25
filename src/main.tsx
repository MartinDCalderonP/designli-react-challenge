import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { loadServiceWorker } from './services/serviceWorker'
import ApiKeyProvider from './contexts/ApiKeyProvider'
import ThemeProvider from './contexts/ThemeProvider'
import StockProvider from './contexts/StockProvider'
import App from './App'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    loadServiceWorker()
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiKeyProvider>
      <ThemeProvider>
        <StockProvider>
          <App />
        </StockProvider>
      </ThemeProvider>
    </ApiKeyProvider>
  </StrictMode>
)
