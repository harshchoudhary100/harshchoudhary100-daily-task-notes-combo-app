import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import Toast from './components/Toast'
import { setAuthToken } from './services/api' 
import { DataProvider } from './context/DataContext';  

// set token for axios if present (important)
const t = localStorage.getItem('token')
if (t) setAuthToken(t)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <App />
          <Toast />
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
