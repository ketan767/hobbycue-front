import React, { useState, useRef, useEffect } from 'react'
import { Button, CircularProgress, MenuItem, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import StatusDropdown from '@/components/_formElements/StatusDropdown'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import Image from 'next/image'
import peopleSvg from '@/assets/svg/People.svg'
import placeSvg from '@/assets/svg/Place.svg'

import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '../../CreatePost/Dropdown/DropdownOption'
import {
  getAllEventRelationTypes,
  getAllListingRelationTypes,
} from '@/services/listing.service'
import { useRouter } from 'next/router'

type Props = {
  data?: any
  handleSubmit?: any
  handleClose?: any
  parentType?: 'place' | 'people'
}

const ListingAddEvent: React.FC<Props> = ({
  handleSubmit,
  handleClose,
  data,
  parentType,
}) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const [options, setOptions] = useState<
    {
      Show: string
      Side: string
      pageType: string
      relationType: string
      _id: string
    }[]
  >([])
  const listingPageData = useSelector(
    (state: RootState) => state.site.listingPageData,
  )
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const router = useRouter()

  useEffect(() => {
    const fetchRelations = async () => {
      let query = `pageType=${
        listingPageData.type === 1 ? 'People' : 'Place'
      }&Show=Y`
      const { err, res } = await getAllEventRelationTypes(query)

      if (err) {
        console.log({ err })
      } else if (res?.data && res?.data?.data) {
        setOptions(
          res.data.data.filter(
            (obj: any) =>
              obj?.pageType ===
              (listingPageData.type === 1 ? 'People' : 'Place'),
          ),
        )
        console.log({ d: res.data.data })
      }
    }
    fetchRelations()
  }, [])

  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleFormSubmit = async () => {
    setSubmitBtnLoading(true)
    try {
      const selectedOpt = options?.find((obj) => obj?._id === selectedOption)
      await handleSubmit(selectedOpt?.relationType, selectedOpt?.Side)
      setSnackbar({
        type: 'success',
        display: true,
        message: 'Event added successfully',
      })
    } catch (error) {
      setSnackbar({
        type: 'error',
        display: true,
        message: 'Error adding event',
      })
    } finally {
      setSubmitBtnLoading(false)
    }
  }

  const handleChange = (str: string) => {
    setSelectedOption(str)
  }

  const dispatch = useDispatch()

  const closeModalFunc = () => {
    dispatch(closeModal())
  }

  return (
    <>
      <div className={`${styles['modal-wrapper']}  `}>
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Add Program'}</h4>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={handleClose ?? closeModalFunc}
          />
        </header>

        <div className={styles['modal-hr']} />

        <section className={styles['body']}>
          <p className={styles['description']}>
            You are about to add a Program Page for the following, and it will
            appear under their Events tab
          </p>
          <div className={styles['page-group']}>
            <img
              className={`${
                data?.profile_image ? styles['img'] : styles['default-svg']
              }`}
              src={
                data?.profile_image
                  ? data?.profile_image
                  : data?.type === 1
                  ? peopleSvg.src
                  : placeSvg.src
              }
              alt=""
            />
            <div className={styles['page-details']}>
              <p>{data?.title}</p>
              <div className={styles['user-group']}>
                <img
                  src={data?.type === 1 ? peopleSvg.src : placeSvg.src}
                  alt=""
                />
                <p>
                  {data?.page_type?.map(
                    (str: string, i: number, arr: string[]) =>
                      `${str}${i === arr?.length - 1 ? '' : ','}`,
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className={styles['relation']}>
            <p>Relation</p>
            <InputSelect
              className={styles['select']}
              value={
                options?.find((obj) => obj?._id === selectedOption)
                  ?.relationType
              }
            >
              {options.map((obj, i) => (
                <DropdownOption
                  key={i}
                  type={'hobby'}
                  value={obj._id}
                  display={obj.relationType}
                  options={null}
                  onChange={handleChange}
                  item={obj._id}
                  _id={obj._id}
                />
              ))}
            </InputSelect>
          </div>

          <div>
            {/* <StatusDropdown
              status={data?.status}
              onStatusChange={handleStatusChange}
            /> */}
          </div>
        </section>
        <footer className={styles['footer']}>
          <button
            onClick={() => {
              router.push('/add-listing')
              dispatch(closeModal())
            }}
            className={styles['add-other']}
          >
            Add Other
          </button>
          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleFormSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : (
              'Continue'
            )}
          </button>
          <button
            ref={nextButtonRef}
            className="modal-mob-btn-save"
            onClick={handleFormSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'14px'} />
            ) : (
              'Continue'
            )}
          </button>
        </footer>
      </div>
      <CustomSnackbar
        message={snackbar?.message}
        triggerOpen={snackbar?.display}
        type={snackbar.type === 'success' ? 'success' : 'error'}
        closeSnackbar={() => {
          setSnackbar((prevValue) => ({ ...prevValue, display: false }))
        }}
      />
    </>
  )
}

export default ListingAddEvent
