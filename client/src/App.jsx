import { useContext, useEffect, useState } from 'react'
import { Context } from './main'
import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'

const App = observer(() => {
  
  const {store} = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
      </div>
    </BrowserRouter>
  )
})

export default App
