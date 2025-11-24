import { useEffect } from 'react'
import { store } from '../stores/store'

export const useAuth = () => {
  const { user, isAuth, isLoading, checkAuth } = store

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    isAuth,
    isLoading,
    checkAuth
  }
}