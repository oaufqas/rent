import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import authStore from './stores/store.js'

const store = new authStore()

export const Context = createContext({
  store
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    store
    }}>
    <StrictMode>
      <App />
    </StrictMode>
  </Context.Provider>
)
