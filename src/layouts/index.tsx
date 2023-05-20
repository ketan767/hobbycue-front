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

function SiteMainLayout({ children }: { children: ReactElement }) {
  const { isLoggedIn, isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  )

  const dispatch = useDispatch()
  const router = useRouter()

  const [showPreLoader, setShowPreLoader] = useState(true)

  const [showPageLoader, setShowPageLoader] = useState(false)

  const fetchDetails = async () => {
    // @TODO:

    // Get Profile (User) Details
    const { err: profileErr, res: profileRes } = await getMyProfileDetail()
    if (
      profileErr?.response?.data?.success === false &&
      (profileErr?.response?.data?.message === 'Authentication failed' ||
        profileErr?.response?.data?.message === 'User not found!' ||
        profileErr?.response?.data?.message === 'Session expired!')
    ) {
      logout()
    }

    // If any error or !success, then set user as `not authenticated`
    if (profileErr || !profileRes || !profileRes.data.success)
      return dispatch(updateIsAuthenticated(false))

    dispatch(updateIsAuthenticated(true))
    dispatch(updateUser(profileRes?.data.data.user))

    // Fetch the user Listings pages.
    const { err: listingErr, res: listingRes } = await getListingPages(
      `populate=_hobbies,_address&admin=${profileRes?.data.data.user._id}`
    )

    if (listingErr || !listingRes || !listingRes.data.success) return

    dispatch(updateUserListing(listingRes.data.data.listings))

    // Check the localStorage for `active profile`, then update the active profile using the data.
    const active_profile = localStorage.getItem('active_profile')

    const activeProfile: LocalStorageActiveProfile = JSON.parse(
      active_profile as string
    )

    let activeProfileData: AuthState['activeProfile'] = {
      type: 'user',
      data: profileRes.data.data.user,
    }

    if (activeProfile && activeProfile.type === 'listing') {
      const listing = listingRes.data.data.listings.find(
        (listing: any) => listing._id === activeProfile.id
      )
      if (listing) activeProfileData = { type: 'listing', data: listing }
    }

    dispatch(updateActiveProfile(activeProfileData))

    setShowPreLoader(false)
  }

  /** To check user logged-in status, as it will open the website */
  useEffect(() => {
    if (isLoggedIn && isAuthenticated) return

    const token = localStorage.getItem('token')

    if (!token) {
      dispatch(updateIsLoggedIn(false))
      setShowPreLoader(false)
    } else {
      dispatch(updateIsLoggedIn(true))
      fetchDetails()

      // dispatch(updateActiveProfile({ type: 'user', data: res.data.data.user }))
    }
  }, [isLoggedIn, isAuthenticated])

  /** If user is not onboarded then open the Onboarding model. */
  useEffect(() => {
    if (isLoggedIn && isAuthenticated && !user.is_onboarded) {
      dispatch(openModal({ type: 'user-onboarding', closable: false }))
    }
  }, [isLoggedIn, isAuthenticated, user])

  /** Handles `showPageLoader` while page changes. */
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleStart = (url: any, { shallow }: any) => {
      timeout = setTimeout(() => {
        setShowPageLoader(true)
      }, 200)
    }

    const handleComplete = () => {
      clearTimeout(timeout)
      setShowPageLoader(false)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    // return () => {
    //   router.events.off('routeChangeStart', handleStart)
    //   router.events.off('routeChangeComplete', handleComplete)
    //   router.events.off('routeChangeError', handleComplete)
    // }
  }, [router.pathname])

  return (
    <>
      {showPreLoader && <PreLoader />}
      <Navbar />
      <ModalManager />
      <main className="main-site-wrapper">{children}</main>
      {/* <Footer /> */}
      {showPageLoader && <PageLoader />}
    </>
  )
}

export default SiteMainLayout
