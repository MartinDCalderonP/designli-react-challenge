import type { ReactNode } from 'react'
import { useMemo, useCallback, useEffect } from 'react'
import { ThemeContext } from '@/hooks/useTheme'
import useLocalStorage from '@/hooks/useLocalStorage'

export type Theme = 'dark' | 'light' | null

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useLocalStorage<Theme>({
    key: 'theme',
    initialValue: null
  })

  const setThemeInDom = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme)
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    },
    [setTheme]
  )

  const toggleTheme = useCallback(() => {
    setThemeInDom(theme === 'light' ? 'dark' : 'light')
  }, [theme, setThemeInDom])

  useEffect(() => {
    if (!theme) {
      const prefersDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const initialTheme = prefersDarkScheme ? 'dark' : 'light'
      setThemeInDom(initialTheme)
    } else {
      setThemeInDom(theme)
    }
  }, [theme, setThemeInDom])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeProvider
