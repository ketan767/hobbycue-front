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
const options = [
  'Facebook',
  'Twitter',
  'Instagram',
  'Youtube',
  'SoundCloud',
  'Pinterest',
  'TripAdvisor',
  'Ultimate Guiter',
  'Strava',
  'DeviantArts',
  'Behance',
  'GoodReads',
  'Smule',
  'Chess',
  'BGG',
]
const ListingSocialMediaEditModal = ({ data }: Props) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    let arr = []
    if (user.facebook_url) {
      arr.push({
        socialMedia: 'Facebook',
        url: user.facebook_url,
      })
    }
    if (user.instagram_url) {
      arr.push({
        socialMedia: 'Instagram',
        url: user.instagram_url,
      })
    }
    if (user.twitter_url) {
      arr.push({
        socialMedia: 'Twitter',
        url: user.twitter_url,
      })
    }
    if (user.youtube_url) {
      arr.push({
        socialMedia: 'Youtube',
        url: user.youtube_url,
      })
    }
    if (user.soundcloud_url) {
      arr.push({
        socialMedia: 'SoundCloud',
        url: user.soundcloud_url,
      })
    }
    if (user.pinterest_url) {
      arr.push({
        socialMedia: 'Pinterest',
        url: user.pinterest_url,
      })
    }
    if (user.tripadvisor_url) {
      arr.push({
        socialMedia: 'TripAdvisor',
        url: user.tripadvisor_url,
      })
    }
    if (user.ultimate_guiter_url) {
      arr.push({
        socialMedia: 'Ultimate Guiter',
        url: user.ultimate_guiter_url,
      })
    }
    if (user.strava_url) {
      arr.push({
        socialMedia: 'Strava',
        url: user.strava_url,
      })
    }
    if (user.deviantarts_url) {
      arr.push({
        socialMedia: 'DeviantArts',
        url: user.deviantarts_url,
      })
    }
    if (user.behance_url) {
      arr.push({
        socialMedia: 'Behance',
        url: user.behance_url,
      })
    }
    if (user.goodreads_url) {
      arr.push({
        socialMedia: 'GoodReads',
        url: user.goodreads_url,
      })
    }
    if (user.smule_url) {
      arr.push({
        socialMedia: 'Smule',
        url: user.smule_url,
      })
    }
    if (user.chess_url) {
      arr.push({
        socialMedia: 'Chess',
        url: user.chess_url,
      })
    }
    if (user.bgg_url) {
      arr.push({
        socialMedia: 'BGG',
        url: user.bgg_url,
      })
    }
    if (arr.length > 0) {
      setMediaData(arr)
    }
  }, [user])

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
  const handleDelete = (item: any) => {
    let updated = mediaData.filter(
      (media: any) => item.socialMedia !== media.socialMedia,
    )
    setMediaData(updated)
  }
  console.log('item', mediaData)

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {
      facebook_url: getValue('Facebook'),
      instagram_url: getValue('Instagram'),
      twitter_url: getValue('Twitter'),
      youtube_url: getValue('Youtube'),
      soundcloud_url: getValue('SoundCloud'),
      pinterest_url: getValue('Pinterest'),
      tripadvisor_url: getValue('TripAdvisor'),
      ultimate_guiter_url: getValue('Ultimate_Guiter'),
      strava_url: getValue('Strava'),
      deviantarts_url: getValue('DeviantArts'),
      behance_url: getValue('Behance'),
      goodreads_url: getValue('GoodReads'),
      smule_url: getValue('Smule'),
      chess_url: getValue('Chess'),
      bgg_url: getValue('BGG'),
    }
    // console.log('re', reqBody)
    const { err, res } = await updateMyProfileDetail(reqBody)

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }

    if (err) return console.log(err)
    if (res?.data.success) {
      console.log('res', res)
      //window.location.reload()
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
            <div className={styles.inputContainer} key={idx}>
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
                onClick={() => handleDelete(item)}
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
