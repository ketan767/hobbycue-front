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

type Props = {
  data?: ProfilePageData['pageData']
}
const options = ['Facebook', 'Twitter', 'Instagram']
const SocialMediaEditModal = ({ data }: Props) => {
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false)
  const [relation, setRelation] = useState('')
  const { user } = useSelector((state: any) => state.user)

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

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    let reqBody: any = {
      facebook_url: getValue('Facebook'),
      instagram_url: getValue('Instagram'),
      twitter_url: getValue('Twitter'),
    }
    // console.log('re', reqBody)
    const { err, res } = await updateMyProfileDetail(reqBody)

    if (err) {
      setSubmitBtnLoading(false)
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()
    setSubmitBtnLoading(false)

    if (error) return console.log(error)
    if (response?.data.success) {
      console.log('response', response)
      dispatch(updateUser(response.data.data.user))
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

export default SocialMediaEditModal
