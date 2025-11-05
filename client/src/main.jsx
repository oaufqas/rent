import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Store from './store/store.js'

const store = new Store()

export const Context = createContext({
  store
})

createRoot(document.getElementById('root')).render(
  <Context.Provider value={{
    store
    }}>
    <StrictMode>
      <App />
    </StrictMode>,
  </Context.Provider>
)
