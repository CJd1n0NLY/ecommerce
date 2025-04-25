import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const auth = useAuth()

  if (auth.isAuthenticated() && to.path === '/') {
    return navigateTo('/user-dashboard')
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return navigateTo('/')
  }

  if (!auth.isAuthenticated() && to.path === '/user-dashboard') {
    return navigateTo('/')
  }
})