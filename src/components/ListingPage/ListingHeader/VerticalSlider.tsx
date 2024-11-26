import React, { useEffect, useRef, useState } from 'react'
import styles from './VerticalSlider.module.css'
import { updateListing, updateListingProfile } from '@/services/listing.service'
import { getMetadata, uploadImage } from '@/services/post.service'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateActiveProductImg,
  updateListingLayoutMode,
  updatePhotoEditModalData,
} from '@/redux/slices/site'
import { openModal } from '@/redux/slices/modal'
import ReactPlayer from 'react-player'
import Image from 'next/image'

import PauseIcon from '@/assets/svg/play_arrow.svg'
import { isMobile } from '@/utils'
import ProductImageSlider from './ProductImageSlider'

interface Props {
  data: ListingPageData['pageData']
}

const VerticalSlider: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoimg, setMetaDataImg] = useState('')
  const scrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -100, behavior: 'smooth' })
    }
  }
  const { listingLayoutMode } = useSelector((state: any) => state.site)
  const dispatch = useDispatch()

  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 100, behavior: 'smooth' })
    }
  }
  const handleImageChange = (e: any) => {
    const image = e.target.files[0]
    UploadProfileImg(e, 'array') // Use 'array' to distinguish this from 'profile'
  }

  const handleImageUpload = async (
    image: any,

    isVideo: boolean,
  ) => {
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      updateListingPage(img)
    }
  }
  const updateListingPage = async (url: string) => {
    let arr: any = []
    if (data?.images) {
      arr = data.images
    }

    const { err, res } = await updateListing(data._id, {
      images: [...arr, url],
    })
    if (err) return console.log(err)
    window.location.reload()
    console.log(res)
  }

  const updateActiveImgIndex = (idx: number, activetype: string) => {
    dispatch(updateActiveProductImg({ idx, type: activetype }))
  }

  const UploadProfileImg = (e: any, type: 'profile' | 'array') => {
    e.preventDefault()
    let files = e.target.files

    if (files.length === 0) return

    const reader = new FileReader()
    reader.onload = () => {
      dispatch(
        updatePhotoEditModalData({
          type,
          image: reader.result,
          onComplete:
            type === 'profile'
              ? handleUserProfileUpload
              : handleArrayImageUpload,
        }),
      )
      dispatch(
        openModal({
          type: 'upload-image',
          closable: true,
          propData: {
            isProduct: true,
          },
        }),
      )
    }
    reader.readAsDataURL(files[0])
  }

  const handleArrayImageUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('post', blob)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      const img = res.data.data.url
      updateListingPage(img)
    }
  }

  const handleUserProfileUpload = async (image: any) => {
    const response = await fetch(image)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('listing-profile', blob)
    const { err, res } = await updateListingProfile(data._id, formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      window.location.reload()
    }
  }
  const updatevideoThumbnail = async () => {
    if (data.video_url)
      getMetadata(data.video_url).then((res: any) => {
        setMetaDataImg(res?.res?.data.data.data?.image ?? '')
      })
  }

  useEffect(() => {
    updatevideoThumbnail()
  })

  const uploadIcon = (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.0811" cy="11.3848" r="11" fill="#8064A2" />
      <g clip-path="url(#clip0_16381_26510)">
        <path
          d="M15.293 10.2553C14.9034 8.27878 13.1674 6.79492 11.082 6.79492C9.4263 6.79492 7.98828 7.7345 7.27214 9.1095C5.54766 9.29284 4.20703 10.7538 4.20703 12.5241C4.20703 14.4204 5.74818 15.9616 7.64453 15.9616H15.0924C16.6737 15.9616 17.957 14.6783 17.957 13.097C17.957 11.5845 16.7826 10.3585 15.293 10.2553ZM12.2279 11.9512V14.2428H9.9362V11.9512H8.21745L11.082 9.08659L13.9466 11.9512H12.2279Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_16381_26510">
          <rect
            width="13.75"
            height="13.75"
            fill="white"
            transform="translate(4.20703 4.50488)"
          />
        </clipPath>
      </defs>
    </svg>
  )

  const upArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
    >
      <g clip-path="url(#clip0_16381_26632)">
        <rect
          x="0.581055"
          y="0.384766"
          width="20"
          height="20"
          rx="10"
          fill="black"
          fillOpacity="0.65"
        />
        <path
          d="M13.8144 8.12656L10.5811 11.3599L7.34774 8.12656C7.02274 7.80156 6.49774 7.80156 6.17274 8.12656C5.84774 8.45156 5.84774 8.97656 6.17274 9.30156L9.99774 13.1266C10.3227 13.4516 10.8477 13.4516 11.1727 13.1266L14.9977 9.30156C15.3227 8.97656 15.3227 8.45156 14.9977 8.12656C14.6727 7.8099 14.1394 7.80156 13.8144 8.12656Z"
          fill="white"
        />
      </g>
      <rect
        x="0.831055"
        y="0.634766"
        width="19.5"
        height="19.5"
        rx="9.75"
        stroke="white"
        stroke-width="0.5"
      />
      <defs>
        <clipPath id="clip0_16381_26632">
          <rect
            x="0.581055"
            y="0.384766"
            width="20"
            height="20"
            rx="10"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  )

  if (isMobile()) {
    return (
      <ProductImageSlider
        data={data}
        UploadProfileImg={UploadProfileImg}
        uploadIcon={uploadIcon}
        videoimg={videoimg}
        handleImageChange={handleImageChange}
      />
    )
  }

  return (
    <div className={styles.sliderContainer}>
      {data.images.length > 3 && (
        <button className={styles.navButton} onClick={scrollUp}>
          {upArrow}
        </button>
      )}
      <div ref={containerRef} className={styles.itemsContainer}>
        {data.profile_image ? (
          <div onClick={() => updateActiveImgIndex(0, 'image')}>
            <img className={styles['item-img']} src={data?.profile_image} />
          </div>
        ) : (
          <div
            className={`${styles['upload-item']} ${
              listingLayoutMode === 'view' ? styles['item-view'] : ''
            }`}
          >
            {listingLayoutMode === 'edit' ? (
              <>
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  className={styles.hidden}
                  onChange={(e) => UploadProfileImg(e, 'profile')}
                />
                {uploadIcon}
                <p>Add Image</p>
              </>
            ) : (
              ''
            )}
          </div>
        )}
        {videoimg ? (
          <div
            onClick={() => updateActiveImgIndex(0, 'video')}
            className={styles['item-video']}
            style={{ position: 'relative' }}
          >
            <img src={videoimg} alt="Video" style={{ width: '100%' }} />
            <Image
              alt="Play video"
              src={PauseIcon}
              className={styles.playIcon}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '30px',
                width: '30px',
              }}
            />
          </div>
        ) : (
          listingLayoutMode === 'edit' && (
            <div
              onClick={() => {
                dispatch(
                  openModal({
                    type: 'upload-video-page',
                    closable: true,
                  }),
                )
              }}
              className={`${styles['item']} ${
                listingLayoutMode === 'view' ? styles['item-view'] : ''
              }`}
            >
              {uploadIcon}
              <p>Add Video</p>
            </div>
          )
        )}
        {data.images.map((image: any, index: any) => (
          <div
            key={index}
            className={`${styles.item} ${
              listingLayoutMode === 'view' ? styles['item-view'] : ''
            }`}
          >
            {image && (
              <img
                className={styles['item-img']}
                src={image}
                onClick={() => {
                  console.warn('data.imagessssss', image)
                  updateActiveImgIndex(index + 1, 'image')
                }}
              />
            )}
          </div>
        ))}

        {listingLayoutMode === 'edit' && (
          <div
            className={`${styles['upload-item']} ${
              listingLayoutMode === 'view' ? styles['item-view'] : ''
            }`}
          >
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              className={styles.hidden}
              onChange={handleImageChange}
            />
            {uploadIcon}
            <p>Add Image</p>
          </div>
        )}
      </div>
      {data.images.length > 3 && (
        <button className={styles.navButton} onClick={scrollDown}>
          {upArrow}
        </button>
      )}
    </div>
  )
}

export default VerticalSlider
