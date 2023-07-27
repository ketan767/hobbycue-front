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

const AboutEditor = dynamic(() => import('@/components/AboutEditor/AboutEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ProfileAboutData = {
  about: string
}

const ProfileAboutEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<ProfileAboutData>({ about: '' })
  const [nextDisabled, setNextDisabled] = useState(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [inputErrs, setInputErrs] = useState<{ about: string | null }>({
    about: null,
  })

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, about: value }
    })
    setInputErrs({ about: null })
  }

  const handleSubmit = async () => {
    if (!data.about || data.about?.trim() === '') {
      setInputErrs((prev) => {
        return { ...prev, about: 'This field is required!' }
      })
      return
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateMyProfileDetail(data)

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
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    if (isEmpty(data.about)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  useEffect(() => {
    setData({
      about: user.about,
    })
  }, [user])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'About'}</h4>
        </header>
        <hr />
        <section className={styles['body']}>
          <div className={styles['input-box']}>
            <label>About</label>
            <input hidden required />
            {/* <CustomCKEditor value={data.about} onChange={handleInputChange} placeholder='Briefly describe about yourself' /> */}
            <AboutEditor value={data.about} onChange={handleInputChange} placeholder='Briefly describe about yourself' />
            {inputErrs.about && (
              <p className={styles['error-msg']}>{inputErrs.about}</p>
            )}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}

          <button
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
        </footer>
      </div>
    </>
  )
}

export default ProfileAboutEditModal

/**
 * @TODO:
 * 1. Loading component untill the CK Editor loads.
 * 2. Underline option in the editor
 */
