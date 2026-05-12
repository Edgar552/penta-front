import React from 'react';
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css';
import {CatalogProvider} from "./Providers/CatalogContext";
import App from './App';
import './assets/fontawesome'
import {AuthProvider} from "./Providers/AuthContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>

      <AuthProvider>

          <QueryClientProvider client={queryClient}>
              <CatalogProvider>
                  <App/>
              </CatalogProvider>
          </QueryClientProvider>

      </AuthProvider>

  </React.StrictMode>
);
