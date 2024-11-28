import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import { updateHobbyByAdmin } from '@/services/admin.service'
import { getAllHobbies } from '@/services/hobby.service'
import { useRouter } from 'next/router'

const AboutEditor = dynamic(
  () => import('@/components/AboutEditor/AboutEditor'),
  {
    ssr: false,
    loading: () => <h1>Loading...</h1>,
  },
)

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  showSkip?: boolean
  CheckIsOnboarded?: any
}

type HobbyAboutData = {
  description: string
  onboarding_step?: string
  completed_onboarding_steps?: any
  _id?: any
}

const HobbyAboutEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  CheckIsOnboarded,
  showSkip,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { } = useSelector((state: RootState) => state.site)
  const [data, setData] = useState<HobbyAboutData>({
    description: '',
  })
  const [hobbyId, sethobbyId] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backDisabled, SetBackDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

  const [inputErrs, setInputErrs] = useState<{ description: string | null }>({
    description: null,
  })
  const [initialData, setInitialData] = useState<HobbyAboutData>({
    description: '',
  })
  const [isChanged, setIsChanged] = useState(false)
  const router = useRouter()
  useEffect(() => {
    // Set initial data when the component mounts
    setInitialData({ description: data.description })
  }, [data])

  const handleInputChange = (value: string) => {
    setData((prev) => ({ ...prev, description: value }))
    setInputErrs({ description: null })

    const hasChanged = value !== initialData.description
    setIsChanged(hasChanged)

    if (onStatusChange) {
      onStatusChange(hasChanged)
    }
  }

  const Backsave = async () => {
    setBackBtnLoading(true)
    if (
      !data.description ||
      data.description?.trim() === '' ||
      data.description === '<p><br></p>'
    ) {
      if (onBackBtnClick) onBackBtnClick()
      setBackBtnLoading(false)
    } else {
      let updatedCompletedSteps = [...user.completed_onboarding_steps]

      const newOnboardingStep =
        Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '2'
      const { err, res } = await updateHobbyByAdmin(hobbyId, data)
      if (err) {
        return console.log(err)
      }

      setBackBtnLoading(true)
      const { err: error, res: response } = await getMyProfileDetail()

      if (error) return console.log(error)
      if (response?.data.success) {
        dispatch(updateUser(response.data.data.user))

        if (onBackBtnClick) onBackBtnClick()
        setBackBtnLoading(false)
      }
    }
  }

  const cleanString = (string: string) => {
    return string
      .replaceAll('<br>', '')
      .replaceAll('<p>', '')
      .replaceAll('</p>', '')
      .trim()
  }

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let updatedCompletedSteps = [...user.completed_onboarding_steps]

    const newOnboardingStep =
      Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '2'
    const { err, res } = await updateHobbyByAdmin(hobbyId, data)
    const { err: error, res: userDataRes } = await getMyProfileDetail()
    if ('data' in userDataRes?.data) {
      if ('user' in userDataRes?.data.data) {
        dispatch(updateUser(userDataRes?.data.data.user))
      }
    }

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }
    if (!res?.data.success) {
      setSubmitBtnLoading(false)
    }

    if (!data.description || cleanString(data.description) === '') {
      if (data.description !== user.description) {
        const newData = { description: cleanString(data.description) }
        setSubmitBtnLoading(true)

        const { err, res } = await updateHobbyByAdmin(hobbyId, data)
        if (err) {
          setSubmitBtnLoading(false)
          return console.log(err)
        }
        const { err: error, res: response } = await getMyProfileDetail()
        setSubmitBtnLoading(false)
        if (error) return console.log(error)
        if (response?.data.success) {
          dispatch(updateUser(response.data.data.user))
          if (onComplete) onComplete()
          else {
            if (!user.is_onboarded) {
              await CheckIsOnboarded()
              return
            } else {
              window.location.reload()
              dispatch(closeModal())
              return
            }
          }
        }
      } else if (user.isOnboarded) dispatch(closeModal())
      else if (onComplete) onComplete()
    } else {
      const newData = { _id: data._id, description: data }
      setSubmitBtnLoading(true)
      let updatedCompletedSteps = [...user.completed_onboarding_steps]

      const newOnboardingStep =
        Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '2'
      const { err, res } = await updateHobbyByAdmin(hobbyId, data)
      if (err) {
        setSubmitBtnLoading(false)
        return console.log(err)
      }
      const { err: error, res: response } = await getMyProfileDetail()
      setSubmitBtnLoading(false)
      if (error) return console.log(error)
      if (response?.data.success) {
        dispatch(updateUser(response.data.data.user))
        if (onComplete) onComplete()
        else {
          if (!user.is_onboarded) {
            await CheckIsOnboarded()
            return
          } else {
            window.location.reload()
            dispatch(closeModal())
            return
          }
        }
      }
    }
  }

  const handleSkip = async () => {
    let updatedCompletedSteps = [...user.completed_onboarding_steps]

    const newOnboardingStep =
      Number(user?.onboarding_step) > 1 ? user?.onboarding_step : '2'
    const { err, res } = await updateMyProfileDetail({
      onboarding_step: newOnboardingStep,
    })

    if (err) {
      return console.log(err)
    }
  }

  const getHobbydata = async () => {
    const { err, res } = await getAllHobbies(
      `slug=${router.query.slug}&populate=category,sub_category,tags,related_hobbies`,
    )
    console.warn('ressssssssssssss', res)
    setData((prev) => ({
      ...prev,
      description: res.data?.hobbies[0]?.description,
    }))
    sethobbyId(res.data?.hobbies[0]?._id)
  }

  useEffect(() => {
    getHobbydata()
  }, [])

  const HandleSaveError = async () => {
    if (
      !data.description ||
      data.description?.trim() === '' ||
      data.description === '<p><br></p>'
    ) {
      setIsError(true)
    }
  }

  useEffect(() => {
    if (confirmationModal) {
      HandleSaveError()
    }
  }, [confirmationModal])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        if (event?.srcElement?.id === 'skipSvg') {
          onComplete?.()
          return
        } else if (
          (typeof event?.srcElement?.className?.includes === 'function' &&
            event?.srcElement?.className?.includes('ql-editor')) ||
          event?.srcElement?.tagName === 'svg'
        ) {
          return
        } else {
          nextButtonRef.current?.click()
        }
        console.log({ event })
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
  // onComplete is handleNext as skip function
  const skipSvg = (
    <svg
      tabIndex={0}
      className={styles.skipIcon}
      onClick={() => {
        handleSkip()
        onComplete?.()
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="66"
      height="25"
      viewBox="0 0 66 25"
      fill="none"
      id="skipSvg"
    >
      {/* <g clip-path="url(#clip0_10384_147186)"> */}
      <rect x="0.796875" width="65.2063" height="25" rx="12.5" fill="#8064A2" />
      <path
        d="M13.2969 0H53.5032C56.9418 0 60.0671 1.40601 62.3328 3.6704C64.5972 5.93607 66.0032 9.06139 66.0032 12.5C66.0032 15.9335 64.5959 19.0588 62.329 21.3258C60.0671 23.5927 56.9405 25 53.5032 25H13.2969C9.85953 25 6.73294 23.5927 4.46855 21.3283L4.41124 21.2659C2.17996 19.0041 0.796875 15.9042 0.796875 12.5C0.796875 9.06139 2.20289 5.93607 4.46728 3.6704C6.73294 1.40601 9.85826 0 13.2969 0ZM47.818 8.06164H49.2457C49.5157 8.06164 49.736 8.28451 49.736 8.55324V16.4468C49.736 16.7155 49.5144 16.9384 49.2457 16.9384H47.818C47.548 16.9384 47.3264 16.7168 47.3264 16.4468V8.55324C47.3264 8.28324 47.548 8.06164 47.818 8.06164ZM18.8904 17.0746C18.3949 17.0746 17.9607 16.9766 17.5862 16.7804C17.2118 16.5843 16.9214 16.3105 16.7177 15.9564C16.5126 15.6037 16.4107 15.1961 16.4107 14.7364V14.3658C16.4107 14.3237 16.4247 14.2868 16.4553 14.2575C16.4846 14.2269 16.5215 14.2129 16.5636 14.2129H18.0332C18.0753 14.2129 18.1122 14.2269 18.1415 14.2575C18.1721 14.2868 18.1861 14.3237 18.1861 14.3658V14.6472C18.1861 14.9109 18.2548 15.1235 18.3911 15.2853C18.5274 15.447 18.698 15.5285 18.9018 15.5285C19.1069 15.5285 19.2775 15.4521 19.4138 15.298C19.5501 15.1452 19.6176 14.9452 19.6176 14.6982C19.6176 14.4422 19.5322 14.2231 19.3628 14.0397C19.1922 13.8563 18.8598 13.5863 18.3656 13.2285C17.939 12.9215 17.5939 12.649 17.3302 12.4108C17.0666 12.1727 16.8412 11.8785 16.6527 11.5295C16.4668 11.1793 16.3725 10.7756 16.3725 10.3146C16.3725 9.59119 16.5979 9.01172 17.0488 8.57743C17.5009 8.14315 18.0969 7.92537 18.8381 7.92537C19.5883 7.92537 20.1907 8.15206 20.6466 8.6029C21.1025 9.05374 21.3305 9.64595 21.3305 10.3795V10.6864C21.3306 10.7067 21.3267 10.7267 21.319 10.7454C21.3113 10.7641 21.2999 10.781 21.2856 10.7952C21.2712 10.8095 21.2542 10.8207 21.2354 10.8283C21.2167 10.8358 21.1966 10.8396 21.1764 10.8393H19.708C19.6878 10.8396 19.6677 10.8358 19.649 10.8283C19.6302 10.8207 19.6132 10.8095 19.5988 10.7952C19.5845 10.781 19.5731 10.7641 19.5654 10.7454C19.5577 10.7267 19.5538 10.7067 19.5539 10.6864V10.34C19.5539 10.0764 19.4877 9.86628 19.3565 9.70835C19.224 9.55043 19.0508 9.47147 18.8381 9.47147C18.6344 9.47147 18.4675 9.54661 18.3402 9.69562C18.2115 9.84462 18.1491 10.0509 18.1491 10.3146C18.1491 10.5706 18.2294 10.796 18.3911 10.9921C18.5529 11.1882 18.8725 11.4608 19.3488 11.8097C19.8774 12.202 20.276 12.5191 20.5447 12.7624C20.8122 13.0056 21.021 13.2731 21.17 13.5672C21.319 13.8614 21.3942 14.2129 21.3942 14.6218C21.3942 15.3706 21.1637 15.9679 20.7039 16.4098C20.2441 16.853 19.6392 17.0746 18.8904 17.0746ZM22.8002 16.9727C22.7799 16.973 22.7597 16.9692 22.7409 16.9616C22.722 16.954 22.7049 16.9426 22.6906 16.9283C22.6762 16.9139 22.6649 16.8968 22.6572 16.878C22.6496 16.8591 22.6458 16.839 22.6461 16.8186V8.18135C22.6458 8.16104 22.6496 8.14087 22.6572 8.12204C22.6649 8.10321 22.6762 8.08611 22.6906 8.07174C22.7049 8.05737 22.722 8.04603 22.7409 8.03839C22.7597 8.03075 22.7799 8.02696 22.8002 8.02725H24.2941C24.3144 8.02696 24.3346 8.03075 24.3534 8.03839C24.3722 8.04603 24.3893 8.05737 24.4037 8.07174C24.4181 8.08611 24.4294 8.10321 24.437 8.12204C24.4447 8.14087 24.4485 8.16104 24.4482 8.18135V11.4009C24.4482 11.4353 24.4584 11.4544 24.48 11.4595C24.5004 11.4633 24.5157 11.448 24.5246 11.4137L26.1726 8.14315C26.2159 8.06673 26.2745 8.02725 26.3521 8.02725H27.9365C27.9963 8.02725 28.0371 8.04254 28.0574 8.07183C28.0791 8.10239 28.0765 8.14697 28.0511 8.20683L26.1598 11.8861C26.1509 11.9205 26.1471 11.946 26.1471 11.9638L28.153 16.7932C28.1619 16.811 28.1657 16.8365 28.1657 16.8696C28.1657 16.9384 28.1237 16.9727 28.0383 16.9727H26.4413C26.3471 16.9727 26.2885 16.9345 26.263 16.8569L24.9334 13.5099C24.9245 13.4845 24.9117 13.473 24.8952 13.4781C24.8786 13.4819 24.8608 13.4921 24.8443 13.5099L24.4736 14.1735C24.4558 14.2078 24.4482 14.2333 24.4482 14.2511V16.8186C24.4485 16.839 24.4447 16.8591 24.437 16.878C24.4294 16.8968 24.4181 16.9139 24.4037 16.9283C24.3893 16.9426 24.3722 16.954 24.3534 16.9616C24.3346 16.9692 24.3144 16.973 24.2941 16.9727H22.8002ZM29.4571 16.9727C29.4138 16.9727 29.3781 16.9575 29.3488 16.9282C29.3183 16.8976 29.303 16.8619 29.303 16.8186V8.18135C29.303 8.13933 29.3183 8.10239 29.3488 8.07183C29.3781 8.04254 29.4138 8.02725 29.4571 8.02725H30.9522C30.9943 8.02725 31.0312 8.04254 31.0605 8.07183C31.0898 8.10239 31.1051 8.13933 31.1051 8.18135V16.8186C31.1051 16.8619 31.0898 16.8976 31.0605 16.9282C31.0312 16.9575 30.9943 16.9727 30.9522 16.9727H29.4571ZM35.3486 8.01452C35.816 8.01452 36.2337 8.13041 36.6005 8.35965C36.966 8.59017 37.25 8.91238 37.45 9.32501C37.6499 9.73765 37.7505 10.2089 37.7505 10.7361C37.7505 11.5295 37.5366 12.1638 37.1112 12.6414C36.6858 13.1177 36.1267 13.3558 35.4377 13.3558H34.4787C34.4367 13.3558 34.4151 13.3775 34.4151 13.4195V16.8186C34.4153 16.8389 34.4116 16.8589 34.404 16.8777C34.3965 16.8964 34.3853 16.9135 34.371 16.9278C34.3568 16.9422 34.3398 16.9535 34.3212 16.9612C34.3025 16.969 34.2824 16.9729 34.2622 16.9727H32.7671C32.7468 16.973 32.7266 16.9692 32.7078 16.9616C32.6889 16.954 32.6718 16.9426 32.6575 16.9283C32.6431 16.9139 32.6317 16.8968 32.6241 16.878C32.6165 16.8591 32.6127 16.839 32.613 16.8186V8.16862C32.613 8.12532 32.6283 8.08966 32.6575 8.06037C32.6881 8.0298 32.7238 8.01452 32.7671 8.01452H35.3486ZM35.0417 11.9511C35.3142 11.9511 35.5332 11.8467 35.7001 11.6378C35.8656 11.4289 35.9484 11.1411 35.9484 10.7756C35.9484 10.3999 35.8656 10.107 35.7001 9.89302C35.5332 9.68034 35.3142 9.57336 35.0417 9.57336H34.4787C34.4367 9.57336 34.4151 9.59501 34.4151 9.63831V11.8861C34.4151 11.9294 34.4367 11.9511 34.4787 11.9511H35.0417ZM45.8236 13.161C46.3165 12.7229 46.3025 12.3319 45.8236 11.8874L41.8883 8.21574C41.3521 7.87952 40.7931 8.07692 40.8083 8.77738L40.8287 16.164C40.8746 16.9218 41.3076 17.1307 41.9469 16.7792L45.8236 13.161ZM53.5032 2.01095H13.2969C10.4135 2.01095 7.79127 3.19154 5.88984 5.09297C3.98842 6.9944 2.80783 9.61666 2.80783 12.5C2.80783 15.3617 3.96804 17.9623 5.83763 19.8574L5.88984 19.9058C7.79127 21.8072 10.4148 22.989 13.2969 22.989H53.5032C56.3853 22.989 59.0088 21.8072 60.9102 19.9058C62.8129 18.0082 63.9922 15.3859 63.9922 12.5C63.9922 9.61666 62.8116 6.9944 60.9102 5.09297C59.0088 3.19154 56.3865 2.01095 53.5032 2.01095Z"
        fill="white"
      />
      {/* </g> */}
      {/* <defs>
        <clipPath id="clip0_10384_147186">
          <rect
            x="0.796875"
            width="65.2063"
            height="25"
            rx="12.5"
            fill="white"
          />
        </clipPath>
      </defs> */}
    </svg>
  )

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
      />
    )
  }

  return (
    <>
      <div
        className={`${styles['modal-wrapper']} ${confirmationModal ? styles['ins-active'] : ''
          }  `}
      >
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'About'}</h4>
          {!user.is_onboarded && showSkip ? skipSvg : null}
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            {/* <label>About</label> */}
            <input hidden required />
            {/* <CustomCKEditor value={data.description} onChange={handleInputChange} placeholder='Briefly describe description yourself' /> */}
            <AboutEditor
              value={data.description}
              onChange={handleInputChange}
              error={inputErrs.description ? true : false}
              placeholder="Briefly describe description yourself"
            />
            {inputErrs.description && (
              <p className={styles['error-msg']}>{inputErrs.description}</p>
            )}
            
          <h3 className={styles['heading']} style={{
            marginTop:10,
            marginBottom:4
          }}>{'Keywords'}</h3>
          {!user.is_onboarded && showSkip ? skipSvg : null}
            <input type='text'/>
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button className="modal-footer-btn cancel" onClick={Backsave}>
                {backBtnLoading ? (
                  <CircularProgress color="inherit" size={'24px'} />
                ) : onBackBtnClick ? (
                  'Back'
                ) : (
                  'Back'
                )}
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={Backsave}>
                <Image
                  src={BackIcon}
                  alt="Back"
                  className="modal-mob-btn cancel"
                />
              </div>
            </>
          )}

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
            ) : (
              'Save'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={NextIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
              disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'14px'} />
              ) : (
                'Save'
              )}
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default HobbyAboutEditModal

/**
 * @TODO:
 * 1. Loading component untill the CK Editor loads.
 * 2. Underline option in the editor
 */
