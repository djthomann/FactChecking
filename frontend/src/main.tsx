import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import './main.css'
import ClientList from './clients/ClientList.tsx'
import ClientForm from "./clients/ClientForm.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={ queryClient }>
          <div className="main p-4">
              <ClientForm />
              <ClientList />
          </div>
      </QueryClientProvider>
  </StrictMode>,
)
