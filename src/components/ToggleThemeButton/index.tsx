import { Sun, Moon } from 'lucide-react'
import styles from './styles.module.css'
import useTheme from '@/hooks/useTheme'
import BaseButton from '../BaseButton'

interface ToggleThemeButtonProps {
  className?: string
}

const ToggleThemeButton = ({ className }: ToggleThemeButtonProps) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <BaseButton
      aria-label='Toggle theme'
      className={`${styles.toggleButton} ${className}`}
      onClick={toggleTheme}
      variant='circle'
    >
      {theme === 'light' ? <Moon /> : <Sun />}
    </BaseButton>
  )
}

export default ToggleThemeButton
