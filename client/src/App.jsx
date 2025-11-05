import { useContext, useEffect, useState } from 'react'
import LoginForm from './components/loginForm'
import { Context } from './main'
import { observer } from 'mobx-react-lite'
import AuthService from './services/AuthService'

function App() {
  
  const {store} = useContext(Context)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  async function getUsers() {
    try {
      const response = await AuthService.gtUsers()
      console.log(response)
      setUsers(response.data)
    } catch (e) {

    }
  }

  if (store.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{store.isAuth ? (
        <>
          {store.user.isActivated ? (
            <>
              <div>
                Пользователь авторизован {store.user.email}
                <button onClick={() => getUsers()}>Получить пользователей</button>
              </div>
              {users.map(user => <div key={user.email}>{user.email}</div>)}
            </>
          ):(
            'Авторизируйте аккаунт'
          )}
        </>
      ) : (
        'Пользователь не авторизован'
      )}</h1>
      <LoginForm/>
    </div>
  )
}

export default observer(App)
