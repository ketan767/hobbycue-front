import Link from 'next/link'
import styles from './styles.module.css'
import Footer from '@/components/Footer/Footer'
import React, { useState } from 'react'
import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import addListingStyles from '@/styles/AddListing.module.css'
import {
  updateListingModalData,
  updateListingTypeModalMode,
} from '@/redux/slices/site'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { showProfileError } from '@/redux/slices/user'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import Head from 'next/head'
import hobbycue4p from '@/assets/image/hobbycue_4p.png'
import {
  setCategory,
  setHobby,
  setKeyword,
  setLocation,
  setSearching,
  setSub_category,
} from '@/redux/slices/explore'

export default function Index() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const handleClick = (type: ListingPages) => {
    if (isLoggedIn && user.is_onboarded) {
      dispatch(updateListingModalData({ type }))
      dispatch(openModal({ type: 'listing-type-edit', closable: true }))
      dispatch(updateListingTypeModalMode({ mode: 'create' }))
    } else if (isLoggedIn && !user.is_onboarded) {
      HandleNotOnboard()
    } else {
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }

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
  return (
    <>
      <Head>
        <meta property="og:image" content={hobbycue4p.src} />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Services</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.dataSection}>
          <div className={styles.about}>
            <h1>Services</h1>
            <p>
              Our services revolve around a Community recommended offering of 4
              Ps – People, Places, Products, and Programs.
            </p>
            <div className={addListingStyles['cards-wrapper']}>
              <section
                onClick={() => {
                  dispatch(setCategory('People'))
                  dispatch(setSearching(true))
                  dispatch(setSub_category(''))
                  dispatch(setKeyword(''))
                  dispatch(setHobby(''))
                  dispatch(setLocation(''))
                  router.push('/explore/people?category=People')
                }}
                className={`${addListingStyles['card']} ${addListingStyles['people']}`}
              >
                <h3>
                  <svg
                    width="40"
                    height="20"
                    viewBox="0 0 40 20"
                    fill="inherit"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 11.25C22.7167 11.25 25.1167 11.9 27.0667 12.75C28.8667 13.55 30 15.35 30 17.3V20H10V17.3167C10 15.35 11.1333 13.55 12.9333 12.7667C14.8833 11.9 17.2833 11.25 20 11.25ZM6.66667 11.6667C8.5 11.6667 10 10.1667 10 8.33333C10 6.5 8.5 5 6.66667 5C4.83333 5 3.33333 6.5 3.33333 8.33333C3.33333 10.1667 4.83333 11.6667 6.66667 11.6667ZM8.55 13.5C7.93333 13.4 7.31667 13.3333 6.66667 13.3333C5.01667 13.3333 3.45 13.6833 2.03333 14.3C0.8 14.8333 0 16.0333 0 17.3833V20H7.5V17.3167C7.5 15.9333 7.88333 14.6333 8.55 13.5ZM33.3333 11.6667C35.1667 11.6667 36.6667 10.1667 36.6667 8.33333C36.6667 6.5 35.1667 5 33.3333 5C31.5 5 30 6.5 30 8.33333C30 10.1667 31.5 11.6667 33.3333 11.6667ZM40 17.3833C40 16.0333 39.2 14.8333 37.9667 14.3C36.55 13.6833 34.9833 13.3333 33.3333 13.3333C32.6833 13.3333 32.0667 13.4 31.45 13.5C32.1167 14.6333 32.5 15.9333 32.5 17.3167V20H40V17.3833ZM20 0C22.7667 0 25 2.23333 25 5C25 7.76667 22.7667 10 20 10C17.2333 10 15 7.76667 15 5C15 2.23333 17.2333 0 20 0Z"
                      fill="inherit"
                    />
                  </svg>
                  <span>People</span>
                </h3>
                <p>
                  An Individual or Organization. Teacher, Coach, Professional or
                  Online Seller. Company, Business or Association.
                </p>
              </section>
              <section
                onClick={() => {
                  dispatch(setCategory('Place'))
                  dispatch(setSearching(true))
                  dispatch(setSub_category(''))
                  dispatch(setKeyword(''))
                  dispatch(setHobby(''))
                  dispatch(setLocation(''))
                  router.push('/explore/places?category=Place')
                }}
                className={`${addListingStyles['card']} ${addListingStyles['place']}`}
              >
                <h3>
                  <svg
                    width="24"
                    height="34"
                    viewBox="0 0 24 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 0.335938C5.55004 0.335938 0.333374 5.5526 0.333374 12.0026C0.333374 20.7526 12 33.6693 12 33.6693C12 33.6693 23.6667 20.7526 23.6667 12.0026C23.6667 5.5526 18.45 0.335938 12 0.335938ZM12 16.1693C9.70004 16.1693 7.83337 14.3026 7.83337 12.0026C7.83337 9.7026 9.70004 7.83594 12 7.83594C14.3 7.83594 16.1667 9.7026 16.1667 12.0026C16.1667 14.3026 14.3 16.1693 12 16.1693Z"
                      fill="inherit"
                    />
                  </svg>
                  <span>Place</span>
                </h3>
                <p>
                  An Address. Classroom, Shop, Performance or Event Venue,
                  Sports Arena, Play Area, Studio, School or Campus.
                </p>
              </section>
              <section
                onClick={() => {
                  dispatch(setCategory('Product'))
                  dispatch(setSearching(true))
                  dispatch(setSub_category(''))
                  dispatch(setKeyword(''))
                  dispatch(setHobby(''))
                  dispatch(setLocation(''))
                  router.push('/explore/products?category=Product')
                }}
                className={`${addListingStyles['card']} ${addListingStyles['product']}`}
              >
                <h3>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M36.5334 12.086V12.3026L34.1001 21.3026C33.8125 22.3709 33.1787 23.3135 32.2981 23.9831C31.4175 24.6526 30.3396 25.0112 29.2334 25.0026H16.4834C15.2317 25.0077 14.0237 24.5431 13.0979 23.7007C12.1722 22.8583 11.596 21.6993 11.4834 20.4526L10.4001 8.18598C10.3625 7.77044 10.1705 7.3841 9.8619 7.10329C9.55332 6.82248 9.15063 6.66762 8.73341 6.66931H5.11674C4.67471 6.66931 4.25079 6.49372 3.93823 6.18116C3.62567 5.8686 3.45007 5.44467 3.45007 5.00265C3.45007 4.56062 3.62567 4.13669 3.93823 3.82413C4.25079 3.51157 4.67471 3.33598 5.11674 3.33598H8.73341C9.98508 3.3309 11.1931 3.79547 12.1189 4.63791C13.0447 5.48035 13.6208 6.63937 13.7334 7.88598V8.33598H33.2167C33.6919 8.33225 34.1623 8.43014 34.5965 8.62308C35.0307 8.81601 35.4186 9.09955 35.7343 9.45466C36.0499 9.80978 36.286 10.2283 36.4267 10.6821C36.5674 11.1359 36.6095 11.6146 36.5501 12.086H36.5334Z"
                      fill="#C0504D"
                    />
                    <path
                      d="M15.1167 36.6693C17.4179 36.6693 19.2834 34.8038 19.2834 32.5026C19.2834 30.2014 17.4179 28.3359 15.1167 28.3359C12.8156 28.3359 10.9501 30.2014 10.9501 32.5026C10.9501 34.8038 12.8156 36.6693 15.1167 36.6693Z"
                      fill="#C0504D"
                    />
                    <path
                      d="M28.4501 36.6693C30.7513 36.6693 32.6168 34.8038 32.6168 32.5026C32.6168 30.2014 30.7513 28.3359 28.4501 28.3359C26.1489 28.3359 24.2834 30.2014 24.2834 32.5026C24.2834 34.8038 26.1489 36.6693 28.4501 36.6693Z"
                      fill="#C0504D"
                    />
                  </svg>

                  <span>Product</span>
                </h3>
                <p>
                  An Item that you can Book, Buy or Rent. Appointment, Ticket,
                  or Voucher. Equipment, Instrument or Activity Kit.
                </p>
              </section>
              <section
                onClick={() => {
                  dispatch(setCategory('Program'))
                  dispatch(setSearching(true))
                  dispatch(setSub_category(''))
                  dispatch(setKeyword(''))
                  dispatch(setHobby(''))
                  dispatch(setLocation(''))
                  router.push('/explore/programs?category=Program')
                }}
                className={`${addListingStyles['card']} ${addListingStyles['program']}`}
              >
                <h3>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M30 6.66146H31.6667C33.5 6.66146 35 8.16146 35 9.99479V33.3281C35 35.1615 33.5 36.6615 31.6667 36.6615H8.33333C6.48335 36.6615 5 35.1615 5 33.3281L5.01667 9.99479C5.01667 8.16146 6.48335 6.66146 8.33333 6.66146H10V4.99479C10 4.07812 10.75 3.32812 11.6667 3.32812C12.5833 3.32812 13.3333 4.07812 13.3333 4.99479V6.66146H26.6667V4.99479C26.6667 4.07812 27.4167 3.32812 28.3333 3.32812C29.25 3.32812 30 4.07812 30 4.99479V6.66146ZM24.951 16.8059C25.4344 16.3226 26.2344 16.3226 26.7177 16.8059C27.201 17.2893 27.201 18.0893 26.701 18.5726L18.8677 26.4059C18.2177 27.0559 17.1677 27.0559 16.5177 26.4059L13.2844 23.1726C12.801 22.6893 12.801 21.8893 13.2844 21.4059C13.7677 20.9226 14.5677 20.9226 15.051 21.4059L17.701 24.0559L24.951 16.8059Z"
                      fill="#0096C8"
                    />
                  </svg>

                  <span>Program</span>
                </h3>
                <p>
                  An Event with Venue and Date. Meetup, Workshop or Webinar.
                  Exhibition, Performance or Competition.
                </p>
              </section>
            </div>
          </div>
          <div className={styles.allPosts}>
            <h2>Blog Posts by Category</h2>
            <select
              onChange={(e) => {
                if (
                  e.target.value === 'Select Category' ||
                  e.target.value === undefined
                ) {
                  return
                } else {
                  window.location.href = e.target.value
                }
              }}
            >
              <option value={undefined}>Select Category</option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/activity/"
              >
                Activity&nbsp;&nbsp;(26)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/activity/fitness"
              >
                &nbsp;&nbsp;&nbsp;Fitness&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/nature"
              >
                &nbsp;&nbsp;&nbsp;Nature&nbsp;&nbsp;(11)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/travel"
              >
                &nbsp;&nbsp;&nbsp;Travel&nbsp;&nbsp;(20)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/wellness"
              >
                &nbsp;&nbsp;&nbsp;Wellness&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/arts/"
              >
                Arts&nbsp;&nbsp;(26)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/artwork"
              >
                &nbsp;&nbsp;&nbsp;Artwork&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/dance"
              >
                &nbsp;&nbsp;&nbsp;Dance&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/literary"
              >
                &nbsp;&nbsp;&nbsp;Literary&nbsp;&nbsp;(5)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/music"
              >
                &nbsp;&nbsp;&nbsp;Music&nbsp;&nbsp;(9)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/photography"
              >
                &nbsp;&nbsp;&nbsp;Photography&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/theatre"
              >
                &nbsp;&nbsp;&nbsp;Theatre&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/visual"
              >
                &nbsp;&nbsp;&nbsp;Visual&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/collect/"
              >
                Collect&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/collect-items/"
              >
                &nbsp;&nbsp;&nbsp;Collect Items&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/making/"
              >
                Making&nbsp;&nbsp;(14)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/cooking"
              >
                &nbsp;&nbsp;&nbsp;Cooking&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/gardening"
              >
                &nbsp;&nbsp;&nbsp;Gardening&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/utility"
              >
                &nbsp;&nbsp;&nbsp;Utility&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/other/"
              >
                Other&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/perform/"
              >
                Perform&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/play/"
              >
                Play&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/play/games"
              >
                &nbsp;&nbsp;&nbsp;Games&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/play/sports"
              >
                &nbsp;&nbsp;&nbsp;Sports&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/uncategorized/"
              >
                Uncategorized&nbsp;&nbsp;(13)
              </option>
            </select>
            <h2 className={styles.mt40}>1 minute Intro</h2>
            <iframe
              id="video-2866-1_youtube_iframe"
              frameBorder="0"
              allowFullScreen={undefined}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="HobbyCue - 1 Minute Intro"
              src="https://www.youtube.com/embed/jd7DWl7woyw?controls=0&amp;rel=0&amp;disablekb=1&amp;showinfo=0&amp;modestbranding=0&amp;html5=1&amp;iv_load_policy=3&amp;autoplay=0&amp;end=0&amp;loop=0&amp;playsinline=0&amp;start=0&amp;nocookie=false&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fhobbycue.com&amp;widgetid=1"
              width="272.5"
              height="153.28125"
            ></iframe>
            <h2 className={styles.mt40}>Recent Posts</h2>
            <Link target="_blank" href={'/blog/the-4-ps-of-a-hobby/'}>
              The 4 Ps of a Hobby
            </Link>
            <Link
              target="_blank"
              href={'/blog/what-is-it-like-to-be-an-artreprenuer/'}
            >
              What is it like to be an artreprenuer?
            </Link>
            <Link
              target="_blank"
              href={'/blog/plan-your-travel-and-tours-on-your-own/'}
            >
              Plan your travel and tours on your own…
            </Link>
            <Link target="_blank" href={'/blog/ponniyin-selvan-characters/'}>
              Ponniyin Selvan main characters (and movie cast)
            </Link>
            <Link
              target="_blank"
              href={'/blog/balance-in-life-for-holistic-wellness-development/'}
            >
              Balance in Life for Holistic Wellness & Development
            </Link>
          </div>
        </div>
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
      <Footer />
    </>
  )
}
