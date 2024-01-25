import TestimonialImg from '@/assets/image/testimonial.png'
import PeopleIllustration from '@/assets/svg/community-bottom.svg'
import landingIllustration from '@/assets/svg/landing-illustration.svg'
import Microphone from '@/assets/svg/microphone.svg'
import PlayIcon from '@/assets/svg/pause-icon.svg'
import PauseIcon from '@/assets/svg/play_arrow.svg'
import AuthForm from '@/components/AuthForm/AuthForm'
import Footer from '@/components/Footer/Footer'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import { openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Home: React.FC<PropTypes> = function () {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)

  const dispatch = useDispatch()
  const openLogin = () => {
    dispatch(openModal({ type: 'auth', closable: true }))
  }
  const user = useSelector((state: RootState) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (user.isLoggedIn) {
      router.push('/community')
    }
  }, [user.isLoggedIn])

  useEffect(() => {
    // Save the scroll position before navigating to another page
    const handleBeforeUnload = () => {
      localStorage.setItem(
        `scrollPosition-${router.route}`,
        window.scrollY.toString(),
      )
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Restore the scroll position when the component mounts
    const savedScrollPosition = localStorage.getItem(
      `scrollPosition-${router.route}`,
    )
    if (savedScrollPosition) {
      const scrollPosition = parseInt(savedScrollPosition, 10)
      window.scrollTo(0, scrollPosition)
    }

    // Clean up the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (localStorage.getItem(`scrollPosition-${router.route}`)) {
        localStorage.removeItem(`scrollPosition-${router.route}`)
      }
    }
  }, [router.route])

  // audio duration format
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  useEffect(() => {
    const updateDuration = () => {

      if (audioRef.current) {
        const audioElement = audioRef.current as HTMLAudioElement
        setDuration(audioElement.duration)
      }
    }

    if (audioRef.current) {
      const audioElement = audioRef.current as HTMLAudioElement
      audioElement.addEventListener('loadedmetadata', updateDuration)
    }

    return () => {
      if (audioRef.current) {
        const audioElement = audioRef.current as HTMLAudioElement
        audioElement.removeEventListener('loadedmetadata', updateDuration)
      }

    }
  }, [])

  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {

    if (audioRef.current) {
      const audioElement = audioRef.current as HTMLAudioElement
      if (isPlaying) {
        audioElement.pause()
      } else {
        audioElement.play()
      }
      setIsPlaying(!isPlaying)

    }
  }

  return (
    <>
      <Head>
        <title>HobbyCue - Your Hobby, Your Community</title>{' '}
        <meta
          name="description"
          content="hobbycue – explore your hobby or passion Sign-in to interact with a community of fellow hobbyists and an eco-system of experts, teachers, suppliers, classes, workshops, and places to practice, participate or perform. Your hobby may be about visual or performing arts, sports, games, gardening, model making, cooking, indoor or outdoor activities… If you are an expert […]"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/** Landing Container **/}
      <section className={styles['landing-contaniner']}>
        <div className={styles['landing-bg']}>
          <main className={`site-container ${styles['landing-wrapper']}`}>
            <div className={`${styles['content']} ${styles['intro-content']}`}>
              <h1>
                Explore your <span>hobby</span> or <span>passion</span>
              </h1>
              <p>
                Sign-in to interact with a community of fellow hobbyists and an
                eco-system of experts, teachers, suppliers, classes, workshops,
                and places to practice, participate or perform.
              </p>

              <p className={styles['hide-paragraph-responsive']}>
                Your hobby may be about visual or performing arts, sports,
                games, gardening, model making, cooking, indoor or outdoor
                activities…
                <br />
                <br />
                If you are an expert or a seller, you can Add your Listing and
                promote yourself, your students, products, services or events.
                Hop on your hobbyhorse and enjoy the ride.
              </p>
              <Image
                src={landingIllustration}
                className={styles['landing-illustration']}
                alt="Landing Illustration"
                // width={500} automatically provided
                // height={500} automatically provided
                // blurDataURL="data:..." automatically provided
                // placeholder="blur" // Optional blur-up while loading
              />
            </div>

            <div className={styles['auth-form']}>
              <AuthForm />
            </div>
          </main>
        </div>
      </section>

      {/** Cards Container **/}
      <section className={`${styles['cards-container']}`}>
        {/* `4Ps Cards` Section */}
        <section className={`site-container  ${styles['four-p-card-wrapper']}`}>
          {/* People Card */}
          <div className={`${styles['card']}`}>
            <h3 className={styles['card-title']}>
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                <path
                  d="M20 11.25C22.7167 11.25 25.1167 11.9 27.0667 12.75C28.8667 13.55 30 15.35 30 17.3V20H10V17.3167C10 15.35 11.1333 13.55 12.9333 12.7667C14.8833 11.9 17.2833 11.25 20 11.25ZM6.66667 11.6667C8.5 11.6667 10 10.1667 10 8.33333C10 6.5 8.5 5 6.66667 5C4.83333 5 3.33333 6.5 3.33333 8.33333C3.33333 10.1667 4.83333 11.6667 6.66667 11.6667ZM8.55 13.5C7.93333 13.4 7.31667 13.3333 6.66667 13.3333C5.01667 13.3333 3.45 13.6833 2.03333 14.3C0.8 14.8333 0 16.0333 0 17.3833V20H7.5V17.3167C7.5 15.9333 7.88333 14.6333 8.55 13.5ZM33.3333 11.6667C35.1667 11.6667 36.6667 10.1667 36.6667 8.33333C36.6667 6.5 35.1667 5 33.3333 5C31.5 5 30 6.5 30 8.33333C30 10.1667 31.5 11.6667 33.3333 11.6667ZM40 17.3833C40 16.0333 39.2 14.8333 37.9667 14.3C36.55 13.6833 34.9833 13.3333 33.3333 13.3333C32.6833 13.3333 32.0667 13.4 31.45 13.5C32.1167 14.6333 32.5 15.9333 32.5 17.3167V20H40V17.3833ZM20 0C22.7667 0 25 2.23333 25 5C25 7.76667 22.7667 10 20 10C17.2333 10 15 7.76667 15 5C15 2.23333 17.2333 0 20 0Z"
                  fill="#8064A2"
                />
              </svg>
              <span>People</span>
            </h3>
            <p className={styles['card-desc']}>
              Find a teacher, coach, or expert for your hobby interest in your
              locality. Find a partner, teammate, accompanist or collaborator.
            </p>
            <OutlinedButton
              className={styles['card-btn']}
              onClick={() => router.push('/search')}
            >
              Connect
            </OutlinedButton>
          </div>

          {/* Place Card */}
          <div className={`${styles['card']}`}>
            <h3 className={styles['card-title']}>
              <svg width="24" height="34" viewBox="0 0 24 34" fill="none">
                <path
                  d="M12 0.333252C5.55 0.333252 0.333328 5.54992 0.333328 11.9999C0.333328 20.7499 12 33.6666 12 33.6666C12 33.6666 23.6667 20.7499 23.6667 11.9999C23.6667 5.54992 18.45 0.333252 12 0.333252ZM12 16.1666C9.7 16.1666 7.83333 14.2999 7.83333 11.9999C7.83333 9.69992 9.7 7.83325 12 7.83325C14.3 7.83325 16.1667 9.69992 16.1667 11.9999C16.1667 14.2999 14.3 16.1666 12 16.1666Z"
                  fill="#77933C"
                />
              </svg>

              <span>Place</span>
            </h3>
            <p className={styles['card-desc']}>
              Find a class, school, playground, auditorium, studio, shop or an
              event venue. Book a slot at venues that allow booking through
              hobbycue.
            </p>
            <OutlinedButton
              className={styles['card-btn']}
              onClick={() => router.push('/search')}
            >
              Meet up
            </OutlinedButton>
          </div>

          {/* Product Card */}
          <div className={`${styles['card']}`}>
            <h3 className={styles['card-title']}>
              <svg
                width="35"
                viewBox="0 0 38 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27.6833 11.9995L20.3833 1.06621C20.0667 0.599544 19.5333 0.366211 19 0.366211C18.4667 0.366211 17.9333 0.599544 17.6167 1.08288L10.3167 11.9995H2.33332C1.41666 11.9995 0.666656 12.7495 0.666656 13.6662C0.666656 13.8162 0.683323 13.9662 0.733323 14.1162L4.96666 29.5662C5.34999 30.9662 6.63332 31.9995 8.16666 31.9995H29.8333C31.3667 31.9995 32.65 30.9662 33.05 29.5662L37.2833 14.1162L37.3333 13.6662C37.3333 12.7495 36.5833 11.9995 35.6667 11.9995H27.6833ZM14 11.9995L19 4.66621L24 11.9995H14ZM19 25.3329C17.1667 25.3329 15.6667 23.8329 15.6667 21.9995C15.6667 20.1662 17.1667 18.6662 19 18.6662C20.8333 18.6662 22.3333 20.1662 22.3333 21.9995C22.3333 23.8329 20.8333 25.3329 19 25.3329Z"
                  fill="#C0504D"
                />
              </svg>

              <span>Product</span>
            </h3>
            <p className={styles['card-desc']}>
              Find equipment or supplies required for your hobby. Buy, rent or
              borrow from shops, online stores or from community members.
            </p>
            <OutlinedButton
              className={styles['card-btn']}
              onClick={() => router.push('/search')}
            >
              Get it
            </OutlinedButton>
          </div>

          {/* Program Card */}
          <div className={`${styles['card']}`}>
            <h3 className={styles['card-title']}>
              <svg
                width={30}
                viewBox="0 0 30 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="3" y="12" width="24" height="19" fill="#0096C8" />
                <path
                  d="M21.6667 16.5498C21.1833 16.0665 20.3833 16.0665 19.9 16.5498L12.65 23.7998L10 21.1498C9.51667 20.6665 8.71667 20.6665 8.23333 21.1498C7.75 21.6332 7.75 22.4332 8.23333 22.9165L11.4667 26.1498C12.1167 26.7998 13.1667 26.7998 13.8167 26.1498L21.65 18.3165C22.15 17.8332 22.15 17.0332 21.6667 16.5498ZM26.6667 3.99984H25V2.33317C25 1.4165 24.25 0.666504 23.3333 0.666504C22.4167 0.666504 21.6667 1.4165 21.6667 2.33317V3.99984H8.33333V2.33317C8.33333 1.4165 7.58333 0.666504 6.66667 0.666504C5.75 0.666504 5 1.4165 5 2.33317V3.99984H3.33333C1.48333 3.99984 0.0166667 5.49984 0.0166667 7.33317L0 30.6665C0 32.4998 1.48333 33.9998 3.33333 33.9998H26.6667C28.5 33.9998 30 32.4998 30 30.6665V7.33317C30 5.49984 28.5 3.99984 26.6667 3.99984ZM25 30.6665H5C4.08333 30.6665 3.33333 29.9165 3.33333 28.9998V12.3332H26.6667V28.9998C26.6667 29.9165 25.9167 30.6665 25 30.6665Z"
                  fill="#0096C8"
                />
                <path
                  d="M21.7958 16.3625C21.3125 15.8792 20.5125 15.8792 20.0292 16.3625L12.7792 23.6125L10.1292 20.9625C9.64583 20.4792 8.84583 20.4792 8.3625 20.9625C7.87917 21.4458 7.87917 22.2458 8.3625 22.7292L11.5958 25.9625C12.2458 26.6125 13.2958 26.6125 13.9458 25.9625L21.7792 18.1292C22.2792 17.6458 22.2792 16.8458 21.7958 16.3625Z"
                  fill="white"
                />
              </svg>

              <span>Program</span>
            </h3>
            <p className={styles['card-desc']}>
              Find events, meetups and workshops related to your hobby. Register
              or buy tickets online.
            </p>
            <OutlinedButton
              className={styles['card-btn']}
              onClick={() => router.push('/search')}
            >
              Attend
            </OutlinedButton>
          </div>
        </section>

        {/* `Add Your Own Page` - Section */}
        <section className={styles['add-your-page-wrapper']}>
          {/* Add Your Own Card  */}
          <div className={`site-container ${styles['card']}`}>
            <h3 className={styles['card-title']}>
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 0.333496C7.80001 0.333496 0.333344 7.80016 0.333344 17.0002C0.333344 26.2002 7.80001 33.6668 17 33.6668C26.2 33.6668 33.6667 26.2002 33.6667 17.0002C33.6667 7.80016 26.2 0.333496 17 0.333496ZM23.6667 18.6668H18.6667V23.6668C18.6667 24.5835 17.9167 25.3335 17 25.3335C16.0833 25.3335 15.3333 24.5835 15.3333 23.6668V18.6668H10.3333C9.41668 18.6668 8.66668 17.9168 8.66668 17.0002C8.66668 16.0835 9.41668 15.3335 10.3333 15.3335H15.3333V10.3335C15.3333 9.41683 16.0833 8.66683 17 8.66683C17.9167 8.66683 18.6667 9.41683 18.6667 10.3335V15.3335H23.6667C24.5833 15.3335 25.3333 16.0835 25.3333 17.0002C25.3333 17.9168 24.5833 18.6668 23.6667 18.6668Z"
                  fill="#0096C8"
                />
              </svg>

              <span>Add Your Own</span>
            </h3>
            <p className={styles['card-desc']}>
              Are you a teacher or expert? Do you sell or rent out equipment,
              venue or event tickets? Or, you know someone who should be on
              hobbycue? Go ahead and Add your Own page..{' '}
            </p>
            <OutlinedButton
              className={styles['card-btn']}
              onClick={() => router.push('/add-listing')}
            >
              Add new
            </OutlinedButton>
          </div>
        </section>
      </section>

      {/** Testimonial Container  **/}
      <section className={`site-container ${styles['testimonial-contaniner']}`}>
        <h3 className={styles['title']}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 40.0005C31.0277 40.0005 40 31.0282 40 20.0005C40 16.7252 39.1373 13.6637 37.7383 10.9341L36 7.99854L33 4.99854L29.0566 2.2583C26.3293 0.862223 23.2723 0.000490634 20 0.000490347C8.9723 0.000489383 2.71253e-06 8.97278 1.74846e-06 20.0005C7.84383e-07 31.0282 8.97229 40.0005 20 40.0005ZM26 26.9985C23.791 26.9985 22 25.2075 22 22.9985C22 22.9125 22.0204 22.8316 22.0254 22.7466C22.0114 22.6656 22 22.5826 22 22.4966C22 22.2216 22.0526 15.7084 26.5996 12.2974C26.8696 12.0954 27.185 11.9966 27.498 11.9966C27.954 11.9966 28.4042 12.2051 28.6992 12.5981C29.1962 13.2611 29.0624 14.2008 28.4004 14.6978C26.8924 15.8288 26.0568 17.5196 25.5898 19.0396C25.7268 19.0256 25.859 18.9985 26 18.9985C28.209 18.9985 30 20.7895 30 22.9985C30 25.2075 28.209 26.9985 26 26.9985ZM14 26.9985C11.791 26.9985 10 25.2075 10 22.9985C10 22.9125 10.0204 22.8316 10.0254 22.7466C10.0114 22.6656 10 22.5826 10 22.4966C10 22.2216 10.0526 15.7084 14.5996 12.2974C14.8696 12.0954 15.185 11.9966 15.498 11.9966C15.954 11.9966 16.4042 12.2051 16.6992 12.5981C17.1962 13.2611 17.0624 14.2008 16.4004 14.6978C14.8924 15.8288 14.0568 17.5195 13.5898 19.0396C13.7268 19.0256 13.859 18.9985 14 18.9985C16.209 18.9985 18 20.7895 18 22.9985C18 25.2075 16.209 26.9985 14 26.9985Z"
              fill="#8064A2"
            />
          </svg>
          <span>Testimonials</span>
        </h3>

        <div className={styles['testimonial']}>
          <p className={styles['content']}>
            In a fast growing and ever changing city like Bangalore, it
            sometimes becomes very difficult to find or connect with like minded
            people. Websites like hobbycue.com is a great service which helps me
            get in touch with, communicate, connect, and exchange ideas with
            other dancers. It also provides the extra benefit of finding
            products and services that I can avail, which I can be assured is
            going to be of great quality as it comes recommended by people of
            the hobbycue community. To have discussions, to get visibility, and
            to be able to safely explore various hobbies and activities in my
            city, all under one roof, is an excellent idea and I highly
            recommend it.
          </p>
          <div className={styles['testimonial-footer']}>
            <div className={styles['testimonial-audio']}>
              <div className={styles['pause-icon-container']}>
                <audio ref={audioRef} src="./audio.mp4"></audio>
                <Image
                  style={{ cursor: 'pointer' }}
                  onClick={togglePlay}
                  src={isPlaying ? PlayIcon : PauseIcon}
                  alt="pause"
                />
              </div>

              <div className={styles['progressbar']}>
                <input type="range" value={0} max={duration} step="0.1" />
                <span>{duration > 0 && <p>{formatTime(duration)}</p>}</span>
              </div>
              <div className={styles['profile-container']}>
                <Image
                  src={TestimonialImg}
                  alt="TestimonialImg"
                  className={styles.testimonial}
                />
                <Image
                  src={Microphone}
                  alt="Microphone"
                  className={styles.microphone}
                />
              </div>
            </div>
            <div className={styles['testimonial-right']}>
              <Image
                src={TestimonialImg}
                alt="TestimonialImg"
                className={styles.testimonial}
              />
              <div>
                <Link href={'/page/shubha-nagarajan'}>
                  <p> Shubha Nagarajan </p>
                </Link>
                <span> Classical Dancer </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`site-container ${styles.bigTextContainer}`}>
        <p className={`${styles.bigText}`}>
          Your <span className={styles.hobbyText}>Hobby </span> , Your{' '}
          <span className={styles.communityText}>Community...</span>
        </p>
        <div className={styles.getStartedBtn}>
          <FilledButton onClick={openLogin}>Get Started</FilledButton>
        </div>
        <Image
          src={PeopleIllustration}
          className={styles['people-illustration']}
          alt="Landing Illustration"
          // width={500} automatically provided
          // height={500} automatically provided
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
        />
      </section>
      {/* <section className={`site-container ${styles.bigTextContainer}`}>
      </section> */}
      <section className={`site-container`}>
        <Footer />
      </section>
    </>
  )
}
interface PropTypes {}

export default Home
