import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </StrictMode>,
)
