import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie';
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </StrictMode>
)
