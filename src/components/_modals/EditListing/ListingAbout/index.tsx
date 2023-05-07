import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import { getMyProfileDetail, updateMyProfileDetail } from '@/services/user.service'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingAboutData = {
  about: string
}

const ListingAboutEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingPageData } = useSelector((state: RootState) => state.site)

  const [data, setData] = useState<ListingAboutData>({ about: '' })

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

    // setSubmitBtnLoading(true)
    // updateMyProfileDetail(data, (err, res) => {
    //   if (err) {
    //     setSubmitBtnLoading(false)
    //     return console.log(err)
    //   }

    //   getMyProfileDetail('populate=_hobbies,_addresses,primary_address,_listings', (err, res) => {
    //     setSubmitBtnLoading(false)
    //     if (err) return console.log(err)
    //     if (res.data.success) {
    //       dispatch(updateUser(res.data.data.user))
    if (onComplete) onComplete()
    //       else dispatch(closeModal())
    //     }
    //   })
    // })
  }

  useEffect(() => {
    setData({
      about: listingPageData.description,
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
            <CustomCKEditor value={data.about} onChange={handleInputChange} />
            {inputErrs.about && <p className={styles['error-msg']}>{inputErrs.about}</p>}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button className="modal-footer-btn cancel" onClick={onBackBtnClick}>
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
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

export default ListingAboutEditModal

/**
 * @TODO:
 * 1. Loading component until the CK Editor loads.
 * 2. Underline option in the editor
 */
