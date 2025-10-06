import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <App />
                <div className="text-left border-t-1 border-t-gray-300 mt-[30px] pt-[30px] pl-[15px]">2025 - Carlo M.</div>
        </BrowserRouter>
    </Provider>
  </StrictMode>,
)
