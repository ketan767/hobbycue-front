import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button, CircularProgress } from '@mui/material'

import { getMyProfileDetail, updateMyProfileDetail } from '@/services/user.service'

import styles from './styles.module.css'
import { isEmpty, isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
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

const ListingAboutEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [data, setData] = useState<ListingAboutData>({ description: { value: '', error: null } })
  const [nextDisabled, setNextDisabled] = useState(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, description: { value, error: null } }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.description.value)) {
      return setData((prev) => {
        return { ...prev, description: { ...prev.description, error: 'This field is required!' } }
      })
    }

    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      description: data.description.value,
    })
    setSubmitBtnLoading(false)
    if (err) return console.log(err)
    if (res?.data.success) {
      dispatch(updateListingModalData(res.data.data.listing))
      if (onComplete) onComplete()
      else {
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    setData((prev) => {
      return { description: { ...prev.description, value: listingModalData.description as string } }
    })
  }, [user])

  useEffect(() => {
    if (
      isEmpty(data.description.value)
    ) {
      setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

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
            <CustomCKEditor value={data.description.value as string} onChange={handleInputChange} placeholder='Briefly describe your listing page' />
            {data.description.error && (
              <p className={styles['error-msg']}>{data.description.error}</p>
            )}
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

export default ListingAboutEditModal

/**
 * @TODO:
 * 1. Loading component until the CK Editor loads.
 * 2. Underline option in the editor
 */
