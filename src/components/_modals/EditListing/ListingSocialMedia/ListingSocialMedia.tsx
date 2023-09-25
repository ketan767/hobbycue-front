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
  const { listingModalData } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    let arr = []
    const socialMediaUrls = listingModalData.social_media_urls
    if (socialMediaUrls && socialMediaUrls.facebook_url) {
      arr.push({
        socialMedia: 'Facebook',
        url: socialMediaUrls && socialMediaUrls.facebook_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.instagram_url) {
      arr.push({
        socialMedia: 'Instagram',
        url: socialMediaUrls && socialMediaUrls.instagram_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.twitter_url) {
      arr.push({
        socialMedia: 'Twitter',
        url: socialMediaUrls && socialMediaUrls.twitter_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.youtube_url) {
      arr.push({
        socialMedia: 'Youtube',
        url: socialMediaUrls && socialMediaUrls.youtube_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.soundcloud_url) {
      arr.push({
        socialMedia: 'SoundCloud',
        url: socialMediaUrls && socialMediaUrls.soundcloud_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.pinterest_url) {
      arr.push({
        socialMedia: 'Pinterest',
        url: socialMediaUrls && socialMediaUrls.pinterest_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.tripadvisor_url) {
      arr.push({
        socialMedia: 'TripAdvisor',
        url: socialMediaUrls && socialMediaUrls.tripadvisor_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.ultimate_guiter_url) {
      arr.push({
        socialMedia: 'Ultimate Guiter',
        url: socialMediaUrls && socialMediaUrls.ultimate_guiter_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.strava_url) {
      arr.push({
        socialMedia: 'Strava',
        url: socialMediaUrls && socialMediaUrls.strava_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.deviantarts_url) {
      arr.push({
        socialMedia: 'DeviantArts',
        url: socialMediaUrls && socialMediaUrls.deviantarts_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.behance_url) {
      arr.push({
        socialMedia: 'Behance',
        url: socialMediaUrls && socialMediaUrls.behance_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.goodreads_url) {
      arr.push({
        socialMedia: 'GoodReads',
        url: socialMediaUrls && socialMediaUrls.goodreads_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.smule_url) {
      arr.push({
        socialMedia: 'Smule',
        url: socialMediaUrls && socialMediaUrls.smule_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.chess_url) {
      arr.push({
        socialMedia: 'Chess',
        url: socialMediaUrls && socialMediaUrls.chess_url,
      })
    }
    if (socialMediaUrls && socialMediaUrls.bgg_url) {
      arr.push({
        socialMedia: 'BGG',
        url: socialMediaUrls && socialMediaUrls.bgg_url,
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
    const newSocialMedia = { socialMedia: '', url: '' }
    setMediaData((prevMediaData) => [...prevMediaData.slice(), newSocialMedia])
  }

  const getValue = (key: any) => {
    const socialMediaItem = mediaData.find((item) => item.socialMedia === key)
    return socialMediaItem ? socialMediaItem.url : ''
  }

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {
      social_media_urls: {
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
      },
    }
    options.forEach((socialMedia) => {
      const key = socialMedia.toLowerCase() + '_url'
      reqBody[key] = getValue(socialMedia)
    })

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
