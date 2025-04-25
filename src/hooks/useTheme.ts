import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light' | null

export const ThemeContext = createContext<
  | {
      theme: Theme
      toggleTheme: () => void
    }
  | undefined
>(undefined)

const useTheme = () => {
  const ctx = useContext(ThemeContext)

  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')

  return ctx
}

export default useTheme
