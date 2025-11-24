import React, { Suspense, useContext } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import Loader from '../components/ui/Loader/Loader'
import { PageTransition } from '../components/animations/index.js'
import { MainLayout, AuthLayout, AdminLayout } from '../components/layout/index.js'
import { ROUTES, USER_ROLES } from '../utils/constants'
import { routes } from './routes'
import { Context } from '../main.jsx'

const RequireAuth = observer(({ children, roles = [] }) => {
  const { store } = useContext(Context)

  if (!store.isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!store.user.isActivated) {
    return <Navigate to={ROUTES.ACTIVATION_REQUIRED} replace />
  }
  
  if (roles.length > 0 && !roles.includes(store.user?.role)) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  return children
})

const AuthRedirect = observer(({ children }) => {
  const { store } = useContext(Context)
  
  if (store.isLoading) {
    return <Loader />
  }
  
  if (store.isAuth) {
    return <Navigate to={ROUTES.HOME} replace />
  }
  
  return children
})

const LayoutWrapper = ({ layout, children }) => {
  switch (layout) {
    case 'auth':
      return <AuthLayout>{children}</AuthLayout>
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>
    case 'main':
    default:
      return <MainLayout>{children}</MainLayout>
  }
}
      
const RouteElement = observer(({ route }) => {
  let element = <route.element />
  element = <LayoutWrapper layout={route.layout}>{element}</LayoutWrapper>
  
  if (route.authRedirect) {
    element = <AuthRedirect>{element}</AuthRedirect>
  }
  
  if (route.requiresAuth) {
    element = (
        <RequireAuth roles={route.requiredRole ? [route.requiredRole] : []}>
      {element}
    </RequireAuth>
  )
}
  
  return element
})

const AppRouter = observer(() => {
  const location = useLocation()
  const { store } = useContext(Context)
  
  if (store.isLoading) {
    return <Loader fullScreen />
  }

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader fullScreen />}>
        <Routes location={location} key={location.pathname}>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PageTransition>
                  <RouteElement route={route} />
                </PageTransition>
              }
            />
          ))}
          
          <Route path="/auth" element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path="/admin/*" element={<Navigate to={ROUTES.ADMIN} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
})

export default AppRouter