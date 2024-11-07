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
import { closeModal, setVerified } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingAboutData = {
  description: InputData<string>
}

const UploadVideoUser: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [url, setUrl] = useState('')
  const [nextDisabled, setNextDisabled] = useState(false)
  const urlRef = useRef<HTMLInputElement>(null)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    try {
      const { err, res } = await updateMyProfileDetail({
        video_url: url,
      })
      setSubmitBtnLoading(false)
      if (err) return console.log(err)
      if (res?.data.success) {
        if (onComplete) onComplete()
        else {
          // window.location.reload()
          dispatch(setVerified(true))
          dispatch(closeModal())
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log('user', user)

  useEffect(() => {
    if (urlRef.current) {
      urlRef.current.focus()
    }
  }, [])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Add Video Link'}</h4>
        </header>
        <hr className={styles['modal-hr']} />
        <section className={styles['body']}>
          <p className={styles.headerText}> Enter the destination URL </p>
          <label className={styles.label}>URL</label>
          <div className={styles['input-box']}>
            <input
              ref={urlRef}
              autoComplete="new"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit()
                }
              }}
            />
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
            ) : (
              'Add Link'
            )}
          </button>
          <button className="modal-mob-btn-save" onClick={handleSubmit}>
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Add Link'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default UploadVideoUser

/**
 * @TODO:
 * 1. Loading component until the CK Editor loads.
 * 2. Underline option in the editor
 */
