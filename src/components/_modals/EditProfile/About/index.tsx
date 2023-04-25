import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import { getMyProfileDetail, updateMyProfileDetail } from '@/services/userService'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUserDetail } from '@/redux/slices/user'

const CustomCKEditor = dynamic(() => import('./CustomCKEditor'), {
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

const ProfileAboutEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { userDetail } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<ProfileAboutData>({ about: '' })

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [inputErrs, setInputErrs] = useState<{ about: string | null }>({ about: null })

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, about: value }
    })
    setInputErrs({ about: null })
  }

  const handleSubmit = () => {
    if (isEmptyField(data.about)) {
      setInputErrs((prev) => {
        return { ...prev, about: 'This field is required!' }
      })
      return
    }

    setSubmitBtnLoading(true)
    updateMyProfileDetail(data, (err, res) => {
      if (err) {
        setSubmitBtnLoading(false)
        return console.log(err)
      }

      getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
        setSubmitBtnLoading(false)
        if (err) return console.log(err)
        if (res.data.success) {
          dispatch(updateUserDetail(res.data.data.user))
          if (onComplete) onComplete()
          else dispatch(closeModal())
        }
      })
    })
  }

  useEffect(() => {
    setData({
      about: userDetail.about,
    })
  }, [userDetail])

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
            <CustomCKEditor value={data.about} onChange={handleInputChange} />
            {inputErrs.about && <p className={styles['error-msg']}>{inputErrs.about}</p>}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <Button variant="outlined" size="medium" color="primary" onClick={onBackBtnClick}>
              Back
            </Button>
          )}
          <Button
            className={styles['submit']}
            variant="contained"
            size="medium"
            color="primary"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? <CircularProgress color="inherit" size={'22px'} /> : 'Next'}
          </Button>
        </footer>
      </div>
    </>
  )
}

export default ProfileAboutEditModal
