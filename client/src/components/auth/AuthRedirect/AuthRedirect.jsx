import { observer } from 'mobx-react-lite'
import { Navigate } from 'react-router-dom'
import { store } from '../../../stores/store'
import { ROUTES } from '../../../utils/constants'
import Loader from '../../ui/Loader/Loader'

const AuthRedirect = observer(({ children }) => {
  const { isAuth, isLoading } = store
    console.log(isAuth, isLoading)
  if (isLoading) {
    return <Loader />
  }
  
  if (isAuth) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  
  return children
})

export default AuthRedirect