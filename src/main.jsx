import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ThemeProvider } from './hooks/useTheme'
import { SettingsProvider } from './hooks/useSettings'
import { ExpensesProvider } from './hooks/useExpenses'

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
