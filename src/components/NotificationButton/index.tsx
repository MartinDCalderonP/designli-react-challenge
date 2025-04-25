import styles from './styles.module.css'
import { Bell, BellOff } from 'lucide-react'
import useNotificationPermission from '@/hooks/useNotificationPermission'
import BaseButton from '../BaseButton'

interface NotificationButtonProps {
  className?: string
}

const NotificationButton = ({ className }: NotificationButtonProps) => {
  const { permission, requestPermission } = useNotificationPermission()

  return (
    <BaseButton
      className={`${styles.notificationButton} ${className}`}
      disabled={permission === 'denied'}
      onClick={requestPermission}
      variant='circle'
    >
      {permission === 'granted' ? <Bell size={20} /> : <BellOff size={20} />}
    </BaseButton>
  )
}

export default NotificationButton
