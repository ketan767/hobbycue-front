import React, { useState, useEffect, useRef } from 'react'
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
import Image from 'next/image'

import styles from './styles.module.css'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { updateListingModalData } from '@/redux/slices/site'
import { updateListing } from '@/services/listing.service'

import DownArrow from '@/assets/svg/chevron-down.svg'
import TickIcon from '@/assets/svg/tick.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

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

  const [value, setValue] = useState<any>([])
  const [error, setError] = useState(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef: any = useRef()
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))

  const handleSubmit = async () => {
    if (!value || value === '' || value.length === 0) {
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

  const handleChange = (itemToChange: any) => {
    if (value?.includes(itemToChange)) {
      setValue((prev: any) => prev.filter((item: any) => item !== itemToChange))
    } else {
      if (value) {
        setValue((prev: any) => [...prev, itemToChange])
      } else {
        setValue((prev: any) => [itemToChange])
      }
    }
  }

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
          <div className={styles['selected-values']}>
            {value?.map((item: any) => {
              return (
                <div key={item} className={styles['selected-value']}>
                  <p>{item}</p>
                  <Image
                    src={CrossIcon}
                    alt="cancel"
                    onClick={() => handleChange(item)}
                  />
                </div>
              )
            })}
          </div>
          <div className={styles['input-box']}>
            <label>Listing Type</label>
            <input hidden required />

            <FormControl variant="outlined" size="small">
              <div className={styles['select-container']} ref={dropdownRef}>
                <div
                  className={styles['select-input']}
                  onClick={() => setShowDropdown(true)}
                >
                  <p> Select listin tag.. </p>
                  <Image src={DownArrow} alt="down" />
                </div>
                {showDropdown && (
                  <div className={styles['options-container']}>
                    {list.map((item: any, idx: any) => {
                      return (
                        <div
                          className={`${styles['single-option']}  ${
                            value?.includes(item)
                              ? styles['selcted-option']
                              : ''
                          }`}
                          key={item}
                          onClick={() => {
                            handleChange(item)
                            setShowDropdown(false)
                          }}
                        >
                          <p className={styles.tagDesc}>
                            {item}
                            <Image
                              src={TickIcon}
                              alt="down"
                              className={styles['tick-icon']}
                            />
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <p className={styles.error}>
                {error && 'Select a listing type!'}{' '}
              </p>
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
              'Next'
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
