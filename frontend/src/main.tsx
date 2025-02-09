import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { MediaListProvider } from './contexts/MediaListContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <MediaListProvider>
        <RouterProvider router={router} />
      </MediaListProvider>
    </AuthProvider>
  </React.StrictMode>,
) 