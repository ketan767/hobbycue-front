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
import { updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import { useContext } from 'react'
import FilledButton from '@/components/_buttons/FilledButton'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import SaveModal from '../../SaveModal/saveModal'

const CustomCKEditor = dynamic(() => import('@/components/CustomCkEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})
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
}

type ListingAboutData = {
  description: InputData<string>
}

const ListingAboutEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [data, setData] = useState<ListingAboutData>({
    description: { value: '', error: null },
  })
  const [nextDisabled, setNextDisabled] = useState(false)
  const [backBtnLoading, setBackBtnLoading] = useState<boolean>(false)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, description: { value, error: null } }
    })
  }
  const handleBack = async () => {
    if (
      !data.description.value ||
      data.description.value === '' ||
      data.description.value === '<p><br></p>'
    ) {
      if (onBackBtnClick) onBackBtnClick()
      return
    }

    setBackBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, {
      description: data.description.value,
    })
    setBackBtnLoading(false)
    if (err) {
      console.log(err)
      return
    }
    if (res?.data.success) {
      dispatch(updateListingModalData(res.data.data.listing))
      if (onBackBtnClick) onBackBtnClick()
    }
  }

  const handleSubmit = async () => {
    if (
      !data.description.value ||
      data.description.value === '' ||
      data.description.value === '<p><br></p>'
    ) {
      return setData((prev) => {
        return {
          ...prev,
          description: {
            ...prev.description,
            error: 'This field is required!',
          },
        }
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

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    setData((prev) => {
      return {
        description: {
          ...prev.description,
          value: listingModalData.description as string,
        },
      }
    })
  }, [user])

  useEffect(() => {
    if (isEmpty(data.description.value)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
      />
    )
  }
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
            {/* <CustomCKEditor value={data.description.value as string} onChange={handleInputChange} placeholder='Briefly describe your listing page' /> */}
            <AboutEditor
              value={data.description.value as string}
              onChange={handleInputChange}
              placeholder="Briefly describe your listing page"
              error={data.description.error ? true : false}
            />
            {data.description.error && (
              <p className={styles['error-msg']}>{data.description.error}</p>
            )}
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button className="modal-footer-btn cancel" onClick={handleBack}>
              {backBtnLoading ? (
                <CircularProgress color="inherit" size={'24px'} />
              ) : onBackBtnClick ? (
                'Back'
              ) : (
                'Back'
              )}
            </button>
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
