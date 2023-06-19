import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { CircularProgress, FormControl, MenuItem, Select } from '@mui/material'
import DeleteIcon from '@/assets/svg/trash-icon.svg'
import AddIcon from '@/assets/svg/add.svg'
import Image from 'next/image'
import {
  getMyProfileDetail,
  updateMyProfileDetail,
} from '@/services/user.service'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { updateListing } from '@/services/listing.service'

type Props = {
  data?: ProfilePageData['pageData']
}
const options = ['Facebook', 'Twitter', 'Instagram']
const ListingSocialMediaEditModal = ({ data }: Props) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    let arr = []
    if (listingModalData.facebook_url) {
      arr.push({
        socialMedia: 'Facebook',
        url: listingModalData.facebook_url,
      })
    }
    if (listingModalData.instagram_url) {
      arr.push({
        socialMedia: 'Instagram',
        url: listingModalData.instagram_url,
      })
    }
    if (listingModalData.twitter_url) {
      arr.push({
        socialMedia: 'Twitter',
        url: listingModalData.twitter_url,
      })
    }
    if (arr.length > 0) {
      setMediaData(arr)
    }
  }, [listingModalData])

  const [mediaData, setMediaData] = useState([
    {
      socialMedia: 'Facebook',
      url: '',
    },
  ])

  const dispatch = useDispatch()

  const onChange = (idxToChange: any, key: any, value: any) => {
    let temp = mediaData.map((item: any, idx: any) => {
      if (idx === idxToChange) {
        return {
          ...item,
          [key]: value,
        }
      } else {
        return item
      }
    })
    setMediaData(temp)
  }

  const addSocialMedia = () => {
    let updated = [...mediaData, { socialMedia: '', url: '' }]
    setMediaData(updated)
  }

  const getValue = (key: any) => {
    let value = ''
    mediaData.map((item: any) => {
      if (key === item.socialMedia) {
        value = item.url
      }
    })
    return value
  }

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {
      facebook_url: getValue('Facebook'),
      instagram_url: getValue('Instagram'),
      twitter_url: getValue('Twitter'),
    }
    // console.log('re', reqBody)
    const { err, res } = await updateListing(listingModalData._id, reqBody)

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }

    if (err) return console.log(err)
    if (res?.data.success) {
      console.log('res', res)
      window.location.reload()
      dispatch(closeModal())
    }
  }

  return (
    <div className={styles['modal-wrapper']}>
      {/* Modal Header */}
      <header className={styles['header']}>
        <h4 className={styles['heading']}>{'Contact Information'}</h4>
      </header>

      <hr />

      <section className={styles['body']}>
        <div className={styles['body-header']}>
          <p> Social Media </p>
          <Image
            src={AddIcon}
            alt="add"
            className={styles.deleteIcon}
            onClick={addSocialMedia}
          />
        </div>
        {mediaData.map((item: any, idx: any) => {
          return (
            <div className={styles.inputContainer}>
              <Select
                value={item.socialMedia}
                onChange={(e) => {
                  let val = e.target.value
                  onChange(idx, 'socialMedia', val)
                }}
                className={styles.dropdown}
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {options.map((option: any) => {
                  return (
                    <MenuItem key={option} value={option}>
                      <p>{option}</p>
                    </MenuItem>
                  )
                })}
              </Select>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={`URL`}
                  value={item.url}
                  name="url"
                  autoComplete="url"
                  onChange={(e) => {
                    let val = e.target.value
                    onChange(idx, 'url', val)
                  }}
                />
              </div>
              <Image
                src={DeleteIcon}
                alt="delete"
                className={styles.deleteIcon}
              />
            </div>
          )
        })}
      </section>

      <footer className={styles['footer']}>
        <button
          className="modal-footer-btn submit"
          onClick={handleSubmit}
          disabled={submitBtnLoading}
        >
          {submitBtnLoading ? (
            <CircularProgress color="inherit" size={'24px'} />
          ) : (
            'Save'
          )}
        </button>
      </footer>
    </div>
  )
}

export default ListingSocialMediaEditModal
