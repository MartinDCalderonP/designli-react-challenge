import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles.module.css'

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  className?: string
  variant?: 'default' | 'circle'
}

const BaseButton = ({
  children,
  className = '',
  variant = 'default',
  ...props
}: BaseButtonProps) => (
  <button
    className={`${styles.baseButton} ${className} ${styles[variant]}`}
    {...props}
  >
    {children}
  </button>
)

export default BaseButton
