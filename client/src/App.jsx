import { useContext, useEffect, useState } from 'react'
import { Context } from './main'
import { observer } from 'mobx-react-lite'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import Loader from './components/ui/Loader/Loader'


const App = observer(() => {
  
  const {store} = useContext(Context)
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      if (localStorage.getItem('token')) {
        await store.checkAuth()
        // console.log(store.isAuth)
        // console.log(store.user)
      } else {
        store.setLoading(false)
      }
      setIsAppReady(true)
    }


    initializeApp()
  }, [store])

  if (!isAppReady) {
    return <Loader fullScreen />
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
