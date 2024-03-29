import { updateIsAuthenticated, updateIsLoggedIn } from '@/redux/slices/user'
import store from '@/redux/store'

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('modal-shown-after-login')
  localStorage.removeItem('active_profile')
  store.dispatch(updateIsLoggedIn(false))
  store.dispatch(updateIsAuthenticated(false))

  window.location.pathname = '/'
}
