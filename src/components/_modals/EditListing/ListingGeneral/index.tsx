import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { containOnlyNumbers, isEmpty, isEmptyField } from '@/utils'
import { closeModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateUser } from '@/redux/slices/user'
import FilledButton from '@/components/_buttons/FilledButton'
import { updateListingModalData } from '@/redux/slices/site'
import { createNewListing, updateListing } from '@/services/listing.service'
import axios from 'axios'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type ListingGeneralData = {
  title: InputData<string>
  tagline: InputData<string>
  page_url: InputData<string>
  gender: InputData<'male' | 'female' | null>
  year: InputData<string>
  admin_note: InputData<string>
}

const ListingGeneralEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()

  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const [data, setData] = useState<ListingGeneralData>({
    title: { value: '', error: null },
    tagline: { value: '', error: null },
    page_url: { value: '', error: null },
    gender: { value: null, error: null },
    year: { value: '', error: null },
    admin_note: { value: '', error: null },
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef?.current?.focus()
  }, [])
  const handleInputChange = (event: any) => {
    setData((prev) => {
      return {
        ...prev,
        [event.target.name]: { value: event.target.value, error: null },
      }
    })
  }

  const handleSubmit = async () => {
    if (isEmptyField(data.title.value) || !data.title.value) {
      return setData((prev) => {
        return {
          ...prev,
          title: { ...prev.title, error: 'This field is required!' },
        }
      })
    }
    if (isEmptyField(data.page_url.value) || !data.page_url.value) {
      return setData((prev) => {
        return {
          ...prev,
          page_url: { ...prev.page_url, error: 'This field is required!' },
        }
      })
    }
    console.log(data)
    // if(data.year.value && data.year.value?.trim() !== '' && !containOnlyNumbers(data.year.value)) {
    //   return setData((prev) => {
    //     return {
    //       ...prev,
    //       year: { ...prev.year, error: 'Enter a valid year of birth!' },
    //     }
    //   })
    // }
    let jsonData = {
      type: listingModalData.type,
      page_type: listingModalData.page_type,
      title: data.title.value,
      tagline: data.tagline.value,
      page_url: data.page_url.value,
      gender: data.gender.value,
      year: data.year.value,
      admin_note: data.admin_note.value,
    }
    /**
     * If Listing ID is in the object, it means we have to UPDATE a listing
     * Else we have to create NEW listing
     */
    if (listingModalData._id) {
      setSubmitBtnLoading(true)
      const { err, res } = await updateListing(listingModalData._id, jsonData)
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
    } else {
      setSubmitBtnLoading(true)
      const { err, res }: any = await createNewListing(jsonData)
      setSubmitBtnLoading(false)
      if (err) {
        if (err?.response?.status === 500) {
          setData((prev) => {
            return {
              ...prev,
              page_url: {
                ...prev.page_url,
                error: 'This page url is already taken',
              },
            }
          })
        }
        return
      }
      if (res?.data.success) {
        console.log('first')
        dispatch(updateListingModalData(res.data.data.listing))
        if (onComplete) onComplete()
        else dispatch(closeModal())
      }
    }
  }

  useEffect(() => {
    setData({
      title: { value: listingModalData.title as string, error: null },
      tagline: { value: listingModalData.tagline as string, error: null },
      page_url: { value: listingModalData.page_url as string, error: null },
      gender: { value: listingModalData.gender as any, error: null },
      year: { value: listingModalData.year as string, error: null },
      admin_note: { value: listingModalData.admin_note as string, error: null },
    })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/listing/check-page-url/${data.page_url.value}`,
        { headers },
      )
      .then((res) => {
        console.log('res', res)
        if(res.data.message !== "Available!"){
          setData((prev) => {
            return {
              ...prev,
              page_url: {
                ...prev.page_url,
                error: 'This page url is already taken',
              },
            }
          })
          return
        }
        setNextDisabled(false)
        setData((prev) => {
          return {
            ...prev,
            page_url: { ...prev.page_url, error: null },
          }
        })
      })
      .catch((err) => {
        console.log('err', err.response)
        setNextDisabled(true)
        setData((prev) => {
          return {
            ...prev,
            page_url: {
              ...prev.page_url,
              error: 'This page url is already taken',
            },
          }
        })
      })
  }, [data.page_url.value])

  useEffect(() => {
    if (onComplete !== undefined) {
      let pageUrl: any = data.title.value
      console.log(pageUrl)
      pageUrl = pageUrl?.toLowerCase()
      pageUrl = pageUrl?.replace(/ /g, '-')
      setData((prev) => {
        return { ...prev, page_url: { value: pageUrl, error: null } }
      })
    }
  }, [data.title])

  useEffect(() => {
    if (isEmpty(data.title.value) || isEmpty(data.page_url.value)) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [data])

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'General'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <>
            {/* Title */}
            <div
              className={`${styles['input-box']} ${
                data.title.error ? styles['input-box-error'] : ''
              }`}
            >
              <label>Title</label>
              <input
                type="text"
                placeholder="Title"
                autoComplete="title"
                required
                value={data.title.value}
                name="title"
                ref={inputRef}
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.title.error}</p>
            </div>

            {/* Tagline */}
            <div
              className={`${styles['input-box']} ${
                data.tagline.error ? styles['input-box-error'] : ''
              }`}
            >
              <label>Tagline</label>
              <input
                type="text"
                placeholder="Something catchy..."
                value={data.tagline.value}
                name="tagline"
                onChange={handleInputChange}
              />
              <p className={styles['helper-text']}>{data.tagline.error}</p>
            </div>

            {/* Page URL */}
            <div
              className={`${styles['input-box']} ${
                data.page_url.error ? styles['input-box-error'] : ''
              }`}
            >
              <label className={styles['label-required']}>Page URL</label>
              <div className={styles['profile-url-input']}>
                <input
                  type="text"
                  placeholder="page-url"
                  required
                  value={data.page_url.value}
                  name="page_url"
                  onChange={handleInputChange}
                />
                <span>https://hobbycue.com/page/</span>
              </div>
              <p className={styles['helper-text']}>{data.page_url.error}</p>
            </div>

            <div className={styles['year-gender-wrapper']}>
              {/* Year*/}
              {listingModalData.type !== 4 && (
                <div className={styles['input-box']}>
                  <label>
                    {listingModalData.type === 2
                      ? 'Year Of Birth/Establishment'
                      : 'Year'}
                  </label>
                  <input
                    type="text"
                    placeholder="Year"
                    autoComplete="year"
                    value={data.year.value}
                    name="year"
                    onChange={handleInputChange}
                  />
                  <p className={styles['helper-text']}>{data.year.error}</p>
                </div>
              )}

              {/* Gender */}
              {listingModalData.type === 1 && (
                <div className={styles['input-box']}>
                  <label>Gender</label>
                  <div className={styles['gender-radio-btns']}>
                    <p
                      onClick={(e) => {
                        setData((prev) => {
                          return {
                            ...prev,
                            gender: { value: 'male', error: null },
                          }
                        })
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="7.5" stroke="#8064A2" />
                        {data.gender.value === 'male' && (
                          <circle cx="8" cy="8" r="4" fill="#8064A2" />
                        )}
                      </svg>
                      Male
                      <input type="radio" required />
                    </p>

                    <p
                      onClick={(e) => {
                        setData((prev) => {
                          return {
                            ...prev,
                            gender: { value: 'female', error: null },
                          }
                        })
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <circle cx="8" cy="8" r="7.5" stroke="#8064A2" />
                        {data.gender.value === 'female' && (
                          <circle cx="8" cy="8" r="4" fill="#8064A2" />
                        )}
                      </svg>
                      Female
                      <input type="radio" required />
                    </p>
                  </div>
                  <p className={styles['helper-text']}>{data.gender.error}</p>
                </div>
              )}
            </div>

            {/* Note */}
            {listingModalData.type === 1 && (
              <div className={styles['input-box']}>
                <label>Note</label>
                <input
                  type="text"
                  placeholder="This information is visible only to Admins of this Page"
                  autoComplete="nickname"
                  value={data.admin_note.value}
                  name="admin_note"
                  onChange={handleInputChange}
                />
                <p className={styles['helper-text']}>{data.admin_note.error}</p>
              </div>
            )}
          </>
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

export default ListingGeneralEditModal
