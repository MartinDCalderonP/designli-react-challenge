import { FormEvent } from 'react'
import BaseButton from '../BaseButton'
import styles from './styles.module.css'

interface ApiKeyFormProps {
  error: string | null
  fetchSymbols: (apiKey: string) => void
  inputApiKey: string
  isLoading: boolean
  setInputApiKey: (value: string) => void
}

const ApiKeyForm = ({
  error,
  fetchSymbols,
  inputApiKey,
  isLoading,
  setInputApiKey
}: ApiKeyFormProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    fetchSymbols(inputApiKey)
  }

  return (
    <form className={styles.apiKeyForm} onSubmit={handleSubmit}>
      <label htmlFor='apiKey'>Finnhub API Key:</label>
      <input
        className={styles.apiKeyInput}
        id='apiKey'
        onChange={(event) => setInputApiKey(event.target.value)}
        placeholder='Enter your Finnhub API key'
        type='text'
        value={inputApiKey}
      />

      <BaseButton
        className={styles.apiKeyConfirmButton}
        disabled={inputApiKey.length <= 10 || isLoading}
        type='submit'
      >
        {isLoading ? 'Loading...' : 'Confirm API Key'}
      </BaseButton>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <p className={styles.apiKeyHelp}>
        Get a free API key at{' '}
        <a
          href='https://finnhub.io/register'
          rel='noopener noreferrer'
          target='_blank'
        >
          finnhub.io
        </a>
      </p>
    </form>
  )
}

export default ApiKeyForm
