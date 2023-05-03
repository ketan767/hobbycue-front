import { ReactElement } from 'react'
import { Navbar } from '@/components/Navbar/Navbar'
import ModalManager from '@/components/_modals/ModalManager'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { updateIsAuthenticated, updateIsLoggedIn, updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getMyProfileDetail } from '@/services/userService'
import { openModal } from '@/redux/slices/modal'

function SiteMainLayout({ children }: { children: ReactElement }) {
  const { isLoggedIn, isAuthenticated, user } = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn) return

    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(updateIsLoggedIn(false))
    } else {
      dispatch(updateIsLoggedIn(true))
      // @TODO:
      getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
        if (err) return dispatch(updateIsAuthenticated(false))
        if (res.data.success) {
          dispatch(updateIsAuthenticated(true))
          dispatch(updateUser(res.data.data.user))
        }
      })
    }
  }, [isLoggedIn])

  useEffect(() => {
    // If user is not onboarded then open the Onboarding model.
    if (isLoggedIn && isAuthenticated && !user.is_onboarded) {
      dispatch(openModal({ type: 'user-onboarding', closable: false }))
    }
  }, [isLoggedIn, isAuthenticated, user])

  return (
    <>
      <Navbar />
      <ModalManager />
      <main className="main-site-wrapper">{children}</main>
      {/* <Footer /> */}
    </>
  )
}

export default SiteMainLayout
