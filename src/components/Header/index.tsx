import styles from './styles.module.css'
import ToggleThemeButton from '@/components/ToggleThemeButton'
import NotificationButton from '@/components/NotificationButton'
import useSocketConnection from '@/hooks/useSocketConnection'

const Header = () => {
  const socketConnected = useSocketConnection()

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Stock Tracker PWA</h1>

      <div className={styles.connectionStatus}>
        {socketConnected ? (
          <span className={styles.connected}>Connected</span>
        ) : (
          <span className={styles.disconnected}>Disconnected</span>
        )}
      </div>

      <div className={styles.headerActions}>
        <NotificationButton />
        <ToggleThemeButton />
      </div>
    </header>
  )
}

export default Header
