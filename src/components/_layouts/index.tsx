import { ReactElement } from 'react'
import { Navbar } from '../Navbar/Navbar'
import ModalManager from '../_modals/ModalManager'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { updateIsAuthenticated, updateIsLoggedIn, updateUserDetail } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getMyProfileDetail } from '@/services/userService'
import { openModal } from '@/redux/slices/modal'
import PageLoader from '../PageLoader'

function MainLayout({ children }: { children: ReactElement }) {
  const { isLoggedIn, isAuthenticated, userDetail } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn) return

    const token = localStorage.getItem('token')

    if (!token) dispatch(updateIsLoggedIn(false))
    else {
      dispatch(updateIsLoggedIn(true))

      // @TODO:
      getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
        if (err) return dispatch(updateIsAuthenticated(false))
        if (res.data.success) {
          dispatch(updateIsAuthenticated(true))
          dispatch(updateUserDetail(res.data.data.user))
        }
      })
    }
  }, [isLoggedIn])

  useEffect(() => {
    // If user is not onboarded
    console.log(userDetail)
    if (isLoggedIn && isAuthenticated && !userDetail.is_onboarded) {
      dispatch(openModal({ type: 'user-onboarding', closable: false }))
    }
  }, [isLoggedIn, isAuthenticated, userDetail])

  return (
    <>
      <Navbar />
      <ModalManager />
      {/* <PageLoader /> */}
      <main style={{ marginTop: 'var(--navbar-height-desktop)' }}>{children}</main>
      {/* <Footer /> */}
    </>
  )
}

export default MainLayout
