import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider } from './hooks/useTheme'
import { SettingsProvider } from './hooks/useSettings'
import { ExpensesProvider } from './hooks/useExpenses'

const siteUrl = window.location.href
const socialImageUrl = new URL('/social-card.png', window.location.origin).href
document.querySelector('meta[property="og:url"]')?.setAttribute('content', siteUrl)
document.querySelector('meta[property="og:image"]')?.setAttribute('content', socialImageUrl)
document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', socialImageUrl)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <ExpensesProvider>
          <App />
        </ExpensesProvider>
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>,
)
