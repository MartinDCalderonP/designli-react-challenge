import styles from './App.module.css'
import useApiKey from './hooks/useApiKey'
import Header from './components/Header'
import StockForm from './components/StockForm'
import StockCards from './components/StockCards'
import StockChart from './components/StockChart'

const App = () => {
  const { apiKey } = useApiKey()

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div className={styles.leftPanel}>
          <StockForm />
        </div>

        <div className={styles.rightPanel}>
          {apiKey ? (
            <>
              <StockCards />
              <StockChart />
            </>
          ) : (
            <>
              <h2>Please set your API key</h2>
              <p>
                To use the stock tracking features, please set your API key.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
