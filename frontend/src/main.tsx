import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css'
import ClientList from './clients/ClientList.tsx'
import ClientForm from "./clients/ClientForm.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={ queryClient }>
          <ClientForm />
          <ClientList />
      </QueryClientProvider>
  </StrictMode>,
)
