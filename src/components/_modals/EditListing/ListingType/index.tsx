import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material'

import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListingModalData } from '@/redux/slices/site'
import { updateListing } from '@/services/listing.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

const ListingTypeEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)

  const { listingModalData, listingTypeModalMode } = useSelector(
    (state: RootState) => state.site,
  )
  const [list, setList] = useState<any>([])

  const [value, setValue] = useState<string | string[]>([])
  const [error, setError] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    // setSubmitBtnLoading(true)
    if (!value || value === '') {
      return setError(true)
    }
    if (listingTypeModalMode === 'edit') {
      handleEdit()
    } else {
      dispatch(
        updateListingModalData({ ...listingModalData, page_type: value }),
      )
      dispatch(openModal({ type: 'listing-onboarding', closable: false }))
    }
  }
  const handleEdit = async () => {
    // setSubmitBtnLoading(true)
    if (onComplete) {
      dispatch(
        updateListingModalData({ ...listingModalData, page_type: value }),
      )
      dispatch(openModal({ type: 'listing-onboarding', closable: false }))
    } else {
      const { err, res } = await updateListing(listingModalData._id, {
        page_type: value,
      })
      setSubmitBtnLoading(false)
      if (err) return console.log(err)
      if (res?.data.success) {
        dispatch(updateListingModalData(res.data.data.listing))
        window.location.reload()
        dispatch(closeModal())
      }
    }
  }
  const peoplePageTypeList: PeoplePageType[] = [
    'Teacher',
    'Trainer',
    'Coach',
    'Instructor',
    'Academia',
    'Professional',
    'Seller',
    'Specialist',
    'Ensemble',
    'Company',
    'Business',
    'Society',
    'Association',
    'Organization',
  ]
  const placePageTypeList: PlacePageType[] = [
    'Shop',
    'School',
    'Auditorium',
    'Clubhouse',
    'Studio',
    'Play Area',
    'Campus',
  ]
  const programPageTypeList: ProgramPageType[] = [
    'Classes',
    'Workshop',
    'Performance',
    'Event',
  ]

  useEffect(() => {
    switch (listingModalData.type) {
      case 1:
        setList(peoplePageTypeList)
        break
      case 2:
        setList(placePageTypeList)
        break
      case 3:
        setList(programPageTypeList)
        break
      case 4:
        setList(programPageTypeList)
        break
      default:
        setList([])
        break
    }
    setValue(listingModalData.page_type as string)
  }, [listingModalData])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Listing Type'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <p className={styles['info']}>
            Please select two of the most appropriate listing types. One type is
            recommended. Use another type only if it is significantly different
          </p>
          <div className={styles['input-box']}>
            <label>Listing Page Type</label>
            <input hidden required />

            <FormControl variant="outlined" size="small">
              <Select
                // multiple
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {/* <MenuItem value={''}>Select..</MenuItem> */}
                {list.map((item: string, idx: number) => {
                  return (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  )
                })}
              </Select>

              <p className={styles.error}> {error && 'Select a listing type!'} </p>
            </FormControl>
          </div>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              onClick={onBackBtnClick}
            >
              Back
            </Button>
          )}
          <Button
            className={styles['submit']}
            variant="contained"
            size="medium"
            color="primary"
            onClick={handleSubmit}
            disabled={submitBtnLoading || value?.length === 0}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'22px'} />
            ) : listingTypeModalMode === 'edit' ? (
              'Edit'
            ) : (
              'Next'
            )}
          </Button>
        </footer>
      </div>
    </>
  )
}

export default ListingTypeEditModal
