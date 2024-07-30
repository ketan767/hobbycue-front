import React, { useRef } from 'react'
import styles from './VerticalSlider.module.css'
import { updateListing } from '@/services/listing.service'
import { uploadImage } from '@/services/post.service'
import { useDispatch } from 'react-redux'
import { updateActiveProductImg } from '@/redux/slices/site'

interface Props {
  data: ListingPageData['pageData']
}

const VerticalSlider: React.FC<Props> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollUp = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -100, behavior: 'smooth' })
    }
  }
  const dispatch = useDispatch()

  const scrollDown = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: 100, behavior: 'smooth' })
    }
  }
  const handleImageChange = (e: any, index: any) => {
    const images = [...e?.target?.files]
    const image = e?.target?.files[0]
    if (data.images.length === 0) index = 0
    handleImageUpload(image, index, false)
  }

  const handleImageUpload = async (
    image: any,
    index: any,
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
      updateListingPage(img, index)
      // dispatch(closeModal())
    }
  }
  const updateListingPage = async (url: string, index: any) => {
    let arr: any = []
    if (data?.images) {
      arr = [...data.images]
    }
    arr[index] = url + 1
    const { err, res } = await updateListing(data._id, {
      images: arr,
    })
    if (err) return console.log(err)
    window.location.reload()
    console.log(res)
  }

  const updateActiveImgIndex = (idx: number) => {
    dispatch(updateActiveProductImg({ idx, type: 'image' }))
  }

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
          fill-opacity="0.65"
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

  return (
    <div className={styles.sliderContainer}>
      <button className={styles.navButton} onClick={scrollUp}>
        {upArrow}
      </button>
      <div ref={containerRef} className={styles.itemsContainer}>
        {data.images[0] ? (
          <img className={styles['item-img']} src={data?.images[0]} />
        ) : (
          <div className={styles.item}>
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              className={styles.hidden}
              onChange={(e) => handleImageChange(e, 0)}
            />
            {uploadIcon}
            <p>Add Image</p>
          </div>
        )}
        <div className={styles.item}>
          {uploadIcon}
          <p>Add Video</p>
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={styles.item}>
            {data.images[index] ? (
              <img
                className={styles['item-img']}
                src={data.images[index]}
                onClick={() => {
                  updateActiveImgIndex(index)
                }}
              />
            ) : (
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className={styles.hidden}
                onChange={(e) => {
                  console.warn('imageeeeeeee', data.images[index])
                  handleImageChange(e, index)
                }}
              />
            )}
            {!data.images[index] && (
              <>
                {uploadIcon}
                <p>Add Image</p>
              </>
            )}
          </div>
        ))}
      </div>
      <button className={styles.navButton} onClick={scrollDown}>
        {upArrow}
      </button>
    </div>
  )
}

export default VerticalSlider
