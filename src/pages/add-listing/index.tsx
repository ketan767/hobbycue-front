import React, { useEffect, useState } from 'react'
import styles from '@/styles/AddListing.module.css'
import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateEventFlow,
  updateListingModalData,
  updateListingTypeModalMode,
} from '@/redux/slices/site'
import store, { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { showProfileError } from '@/redux/slices/user'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

import {
  createNewListing,
  getAllListingPageTypes,
} from '@/services/listing.service'
import { getMyProfileDetail } from '@/services/user.service'
import Head from 'next/head'

type Props = {}

const AddListing: React.FC<Props> = (props) => {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const { eventflowRunning } = useSelector((state: RootState) => state.site)
  const dispatch = useDispatch()
  const router = useRouter()
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [hoveredIndex, setHoveredIndex] = useState<any>(null)
  const [data, setData] = useState<any[]>([])

  const handleClick = async (type: ListingPages) => {
    if (type === 4) {
      // showFeatureUnderDevelopment()
      dispatch(
        openModal({
          type: 'product-category',
          closable: true,
          propData: 'new',
        }),
      )

      return
    }

    if (isLoggedIn && user.is_onboarded) {
      dispatch(updateListingModalData({ type }))
      dispatch(openModal({ type: 'listing-type-edit', closable: true }))
      dispatch(updateListingTypeModalMode({ mode: 'create' }))
    } else if (isLoggedIn && !user.is_onboarded) {
      HandleNotOnboard()
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
    dispatch(updateEventFlow(false))
  }

  useEffect(() => {
    if (eventflowRunning) {
      handleClick(3)
    }
  }, [eventflowRunning])

  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
  }

  const HandleNotOnboard = () => {
    router.push(`/profile/${user.profile_url}`)
    dispatch(showProfileError(true))
  }

  useEffect(() => {
    getAllListingPageTypes()
      .then((result) => {
        const { err, res } = result
        if (res?.data && res?.data?.data) {
          setData(res.data.data)
        }
      })
      .catch((err) => {
        console.log({ err })
      })
  }, [])
  console.warn('dataaaa', data)

  return (
    <>
      <Head>
        <title>HobbyCue - Add Listing</title>
        <meta
          name="description"
          content="hobbycue – explore your hobby or passion Sign-in to interact with a community of fellow hobbyists and an eco-system of experts, teachers, suppliers, classes, workshops, and places to practice, participate or perform. Your hobby may be about visual or performing arts, sports, games, gardening, model making, cooking, indoor or outdoor activities… If you are an expert […]"
        />
        <link rel="manifest" href="/manifest.json"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:width" content="478" />
        <meta property="og:image:height" content="477" />
        <meta property="og:image:type" content="image/png" />
      </Head>
      <section className={`site-container ${styles['add-listing-container']}`}>
        <h1 className={styles['add-listing-heading']}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_173_53831)">
              <path
                d="M20 3.33594C10.8 3.33594 3.33337 10.8026 3.33337 20.0026C3.33337 29.2026 10.8 36.6693 20 36.6693C29.2 36.6693 36.6667 29.2026 36.6667 20.0026C36.6667 10.8026 29.2 3.33594 20 3.33594ZM26.6667 21.6693H21.6667V26.6693C21.6667 27.5859 20.9167 28.3359 20 28.3359C19.0834 28.3359 18.3334 27.5859 18.3334 26.6693V21.6693H13.3334C12.4167 21.6693 11.6667 20.9193 11.6667 20.0026C11.6667 19.0859 12.4167 18.3359 13.3334 18.3359H18.3334V13.3359C18.3334 12.4193 19.0834 11.6693 20 11.6693C20.9167 11.6693 21.6667 12.4193 21.6667 13.3359V18.3359H26.6667C27.5834 18.3359 28.3334 19.0859 28.3334 20.0026C28.3334 20.9193 27.5834 21.6693 26.6667 21.6693Z"
                fill="#0096C8"
              />
            </g>
            <defs>
              <clipPath id="clip0_173_53831">
                <rect width="40" height="40" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>Add Listing</span>
        </h1>
        <p className={styles['select-text']}>Select Page type</p>
        <div className={styles['cards-wrapper']}>
          {data?.find((obj) => obj.pageType === 'People') && (
            <section
              onMouseEnter={() => setHoveredIndex('People')}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(1 as ListingPages)}
              className={`${styles['card']} ${styles['people']}`}
            >
              <h3>
                <img
                  src={
                    hoveredIndex === 'People'
                      ? data.find((obj) => obj.pageType === 'People')?.hoverImg
                      : data.find((obj) => obj.pageType === 'People')?.img
                  }
                  alt=""
                />
                <span>People</span>
              </h3>
              <p>
                {data.find((obj) => obj.pageType === 'People')?.Description}
              </p>
            </section>
          )}

          {data?.find((obj) => obj.pageType === 'Place') && (
            <section
              onMouseEnter={() => setHoveredIndex('Place')}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(2 as ListingPages)}
              className={`${styles['card']} ${styles['place']}`}
            >
              <h3>
                <img
                  src={
                    hoveredIndex === 'Place'
                      ? data.find((obj) => obj.pageType === 'Place')?.hoverImg
                      : data.find((obj) => obj.pageType === 'Place')?.img
                  }
                  alt=""
                />
                <span>Place</span>
              </h3>
              <p>{data.find((obj) => obj.pageType === 'Place')?.Description}</p>
            </section>
          )}
          {data?.find((obj) => obj.pageType === 'Product') && (
            <section
              onMouseEnter={() => setHoveredIndex('Product')}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(4 as ListingPages)}
              className={`${styles['card']} ${styles['product']}`}
            >
              <h3>
                <img
                  src={
                    hoveredIndex === 'Product'
                      ? data.find((obj) => obj.pageType === 'Product')?.hoverImg
                      : data.find((obj) => obj.pageType === 'Product')?.img
                  }
                  alt=""
                />
                <span>Product</span>
              </h3>
              <p>
                {data.find((obj) => obj.pageType === 'Product')?.Description}
              </p>
            </section>
          )}

          {data?.find((obj) => obj.pageType === 'Program') && (
            <section
              onMouseEnter={() => setHoveredIndex('Program')}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(3 as ListingPages)}
              className={`${styles['card']} ${styles['program']}`}
            >
              <h3>
                <img
                  src={
                    hoveredIndex === 'Program'
                      ? data.find((obj) => obj.pageType === 'Program')?.hoverImg
                      : data.find((obj) => obj.pageType === 'Program')?.img
                  }
                  alt=""
                />
                <span>Program</span>
              </h3>
              <p>
                {data.find((obj) => obj.pageType === 'Program')?.Description}
              </p>
            </section>
          )}
        </div>
        {
          <CustomSnackbar
            message={snackbar?.message}
            triggerOpen={snackbar?.display}
            type={snackbar.type === 'success' ? 'success' : 'error'}
            closeSnackbar={() => {
              setSnackbar((prevValue) => ({ ...prevValue, display: false }))
            }}
          />
        }
      </section>
    </>
  )
}

export default AddListing
