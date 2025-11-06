import React, { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import authStore from '../stores/authStore'
import { Loader } from '../components/ui/Loader/Loader'
// import { PageTransition } from '../components/animations/PageTransition'
// import { MainLayout, AuthLayout, AdminLayout } from '../components/layout'
import { ROUTES, USER_ROLES } from '../utils/constants'
import { routes } from './routes'

const RequireAuth = observer(({ children, roles = [] }) => {
  const { isAuth, user, isLoading } = store
  
  if (isLoading) {
    return <Loader fullScreen />
  }

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
})

const AuthRedirect = observer(({ children }) => {
  const { isAuth, isLoading } = store
  
  if (isLoading) {
    return <Loader />
  }
  
  if (isAuth) {
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
  const { isLoading } = store

  if (isLoading) {
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