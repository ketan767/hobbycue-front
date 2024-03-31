import { ReactElement, useState } from 'react'
import { Navbar } from '@/components/Navbar/Navbar'
import ModalManager from '@/components/_modals/ModalManager'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  AuthState,
  updateActiveProfile,
  updateIsAuthenticated,
  updateIsLoggedIn,
  updateUser,
  updateUserListing,
} from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getMyProfileDetail } from '@/services/user.service'
import { openModal } from '@/redux/slices/modal'
import PageLoader from '@/components/PageLoader'
import { getListingPages } from '@/services/listing.service'
import PreLoader from '@/components/PreLoader'
import { logout } from '@/helper'
import { setShowPageLoader } from '@/redux/slices/site'

function SiteAdminLayout({ children }: { children: ReactElement }) {
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user,
  )
  const { showPageLoader } = useSelector((state: RootState) => state.site)

  const dispatch = useDispatch()
  const router = useRouter()

  const [showPreLoader, setShowPreLoader] = useState(true)

  const fetchDetails = async () => {
    const { err: profileErr, res: profileRes } = await getMyProfileDetail()
    if (
      profileErr?.response?.data?.success === false &&
      (profileErr?.response?.data?.message === 'Authentication failed' ||
        profileErr?.response?.data?.message === 'User not found!' ||
        profileErr?.response?.data?.message === 'Session expired!')
    ) {
      logout()
    }

    if (profileErr || !profileRes || !profileRes.data.success) {
      setShowPreLoader(false)
      return dispatch(updateIsAuthenticated(false))
    }

    dispatch(updateIsAuthenticated(true))
    dispatch(updateUser(profileRes?.data.data.user))

    const { err: listingErr, res: listingRes } = await getListingPages(
      `populate=_hobbies,_address&admin=${profileRes?.data.data.user._id}`,
    )

    if (listingErr || !listingRes || !listingRes.data.success)
      return setShowPreLoader(false)

    dispatch(updateUserListing(listingRes.data.data.listings))

    const active_profile = localStorage.getItem('active_profile')

    const activeProfile: LocalStorageActiveProfile = JSON.parse(
      active_profile as string,
    )

    let activeProfileData: AuthState['activeProfile'] = {
      type: 'user',
      data: profileRes.data.data.user,
    }

    if (activeProfile && activeProfile.type === 'listing') {
      const listing = listingRes.data.data.listings.find(
        (listing: any) => listing._id === activeProfile.id,
      )
      if (listing) activeProfileData = { type: 'listing', data: listing }
    }

    dispatch(updateActiveProfile(activeProfileData))

    setShowPreLoader(false)
  }

  useEffect(() => {
    if (isLoggedIn && isAuthenticated) return setShowPreLoader(false)

    const token = localStorage.getItem('token')

    if (!token) {
      dispatch(updateIsLoggedIn(false))
      setShowPreLoader(false)
    } else {
      dispatch(updateIsLoggedIn(true))
      fetchDetails()
    }
  }, [isLoggedIn, isAuthenticated])

  useEffect(() => {
    if (isLoggedIn && isAuthenticated && !user.is_onboarded) {
      dispatch(openModal({ type: 'user-onboarding', closable: true }))
    }
  }, [isLoggedIn, isAuthenticated, user])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleStart = (url: any, { shallow }: any) => {
      timeout = setTimeout(() => {
        dispatch(setShowPageLoader(true))
      }, 200)
    }

    const handleComplete = () => {
      clearTimeout(timeout)
      dispatch(setShowPageLoader(false))
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
  }, [router.pathname])

  return (
    <>
      {showPreLoader && <PreLoader />}

      <ModalManager />
      <main className="main-site-wrapper">{children}</main>
      {/* <Footer /> */}
      {showPageLoader && <PageLoader />}
    </>
  )
}

export default SiteAdminLayout
