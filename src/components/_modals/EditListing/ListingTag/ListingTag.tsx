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
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { getListingTags, updateListing } from '@/services/listing.service'
import { updateListingModalData } from '@/redux/slices/site'
import InputSelect from '@/components/InputSelect/inputSelect'
import DownArrow from '@/assets/svg/chevron-down.svg'
import TickIcon from '@/assets/svg/tick.svg'
import CrossIcon from '@/assets/svg/cross.svg'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'

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

const ListingTagsEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)
  const [tags, setTags] = useState<
    { _id: string; name: string; description: string }[]
  >([])

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef: any = useRef()
  const [data, setData] = useState<ListingAboutData>({
    description: { value: '', error: null },
  })
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  useOutsideAlerter(dropdownRef, () => setShowDropdown(false))

  const handleInputChange = (value: string) => {
    setData((prev) => {
      return { ...prev, description: { value, error: null } }
    })
  }
  const [value, setValue] = useState<any>([])
  const handleSubmit = async () => {
    const jsonData = {
      _tags: selectedTags,
    }
    setSubmitBtnLoading(true)
    const { err, res } = await updateListing(listingModalData._id, jsonData)
    if (err) return console.log(err)
    console.log('res', res?.data.data.listing)
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  const handleChange = (itemToChange: any) => {
    if (tags?.includes(itemToChange)) {
      setTags((prev: any) => prev.filter((item: any) => item !== itemToChange))
    } else {
      if (tags) {
        setTags((prev: any) => [...prev, itemToChange])
      } else {
        setTags((prev: any) => [itemToChange])
      }
    }
  }

  useEffect(() => {
    if (tags.length > 0) {
      let selected: any = []
      tags.forEach((item: any) => {
        if (listingModalData._tags?.includes(item._id)) {
          selected.push(item._id)
        }
      })
      setSelectedTags(selected)
    }
  }, [listingModalData?._tags, tags])

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
    getListingTags()
      .then((res: any) => {
        const temp = res.res.data.data.tags
        setTags(temp)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])

  const handleTagChange = (idToChange: any) => {
    if (selectedTags.includes(idToChange)) {
      setSelectedTags((prev: any) =>
        prev.filter((item: any) => item !== idToChange),
      )
    } else {
      setSelectedTags((prev: any) => [...prev, idToChange])
    }
  }
  console.log('item', selectedTags)
  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Tags'}</h4>
        </header>
        <hr />
        <section className={styles['body']}>
          <div className={styles['selected-values']}>
            {tags
              ?.filter((item) => selectedTags.includes(item._id)) // Filter tags to show only selected ones
              .map((item: any, idx) => {
                return (
                  <div key={item} className={styles['selected-value']}>
                    <p>{item.name}</p>
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
            <input hidden required />
            <div className={styles['select-container']} ref={dropdownRef}>
              <div
                className={styles['select-input']}
                onClick={() => setShowDropdown(true)}
              >
                <p> Select listing tag.. </p>
                <Image src={DownArrow} alt="down" />
              </div>
              {showDropdown && (
                <div className={styles['options-container']}>
                  {tags.map((item: any, idx) => {
                    return (
                      <div
                        className={`${styles['single-option']}  ${
                          selectedTags.includes(item._id)
                            ? styles['selcted-option']
                            : ''
                        }`}
                        key={item._id}
                        onClick={() => {
                          handleTagChange(item._id)
                          setShowDropdown(false)
                        }}
                      >
                        <p className={`${styles.tagText}`}>{item.name}</p>
                        <p className={styles.tagDesc}>
                          {item.description}
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
            {/* <FormControl variant="outlined" size="small" sx={{ width: '100%' }}>
              <Select
                value={selectedTags}
                multiple={true}
                onChange={(e) => {
                  let val: any = e.target.value
                  if (val) {
                    setSelectedTags((prev: any) => [...val])
                  }
                }}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {tags.map((item: any, idx) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      <div className={styles.tagContainer}>
                        <p className={styles.tagText}>{item.name}</p>
                        <p className={styles.tagDesc}>{item.description}</p>
                      </div>
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl> */}
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

export default ListingTagsEditModal
