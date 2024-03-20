import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'
import { updateImageUrl } from '@/redux/slices/modal'
import styles from './styles.module.css'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { getPages, updateListing } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import PostCard from '@/components/PostCard/PostCard'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { uploadImage } from '@/services/post.service'
import ReactPlayer from 'react-player'
import { useMediaQuery } from '@mui/material'

interface Props {
  data: ListingPageData['pageData']
}

const ListingMediaTab: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const [pagesData, setPagesData] = useState([])
  const { listingLayoutMode, listingModalData } = useSelector(
    (state: RootState) => state.site,
  )
  const { user } = useSelector((state: RootState) => state)
  const [media, setMedia] = useState([])
  // console.log('pagesData', pagesData)

  useEffect(() => {
    // const id = user?.activeProfile?.data?._id
    const id = data?._id
    getPages(id)
      .then((res: any) => {
        console.log('media res', res.res)
        setPagesData(res?.res.data?.data.posts)
        const allposts = res.res.data.data.posts
        let tempMedia: any = []
        allposts.forEach((post: any) => {
          if (post.media) {
            if (post.video_url) {
              tempMedia.push({
                type: 'video',
                src: post.video_url,
              })
            } else {
              post.media.forEach((singleMedia: any) => {
                tempMedia.push({
                  type: 'image',
                  src: singleMedia,
                })
              })
            }
          }
        })
        setMedia(tempMedia)
      })
      .catch((err) => {
        console.log('err', err.response)
      })
  }, [])

  const handleImageChange = (e: any) => {
    const images = [...e.target.files]
    const image = e.target.files[0]
    handleImageUpload(image, false)
  }

  const handleImageUpload = async (image: any, isVideo: boolean) => {
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      updateListingPage(img)
      // dispatch(closeModal())
    }
  }

  const updateListingPage = async (url: string) => {
    let arr: any = []
    if (listingModalData?.images) {
      arr = listingModalData.images
    }
    const { err, res } = await updateListing(listingModalData._id, {
      images: [...arr, url],
    })
    if (err) return console.log(err)
    window.location.reload()
    console.log(res)
  }

  const OpenMediaImage = (image: string) => {
    dispatch(updateImageUrl(image))
    dispatch(
      openModal({
        type: 'View-Image-Modal',
        closable: false,
        imageurl: image,
      }),
    )
  }

  const isMobile = useMediaQuery('(max-width:1100px)')
  const plusIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
    >
      <g clip-path="url(#clip0_11387_36832)">
        <path
          d="M13.6429 8.85763H9.35714V13.1433C9.35714 13.6148 8.97143 14.0005 8.5 14.0005C8.02857 14.0005 7.64286 13.6148 7.64286 13.1433V8.85763H3.35714C2.88571 8.85763 2.5 8.47192 2.5 8.00049C2.5 7.52906 2.88571 7.14335 3.35714 7.14335H7.64286V2.85763C7.64286 2.3862 8.02857 2.00049 8.5 2.00049C8.97143 2.00049 9.35714 2.3862 9.35714 2.85763V7.14335H13.6429C14.1143 7.14335 14.5 7.52906 14.5 8.00049C14.5 8.47192 14.1143 8.85763 13.6429 8.85763Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_11387_36832">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  )
  return (
    <>
      <main className={styles['main']}>
        <div className={styles.uploadContainer}>
          {data?.admin === user?.user._id && (
            <>
              {isMobile ? (
                <>
                  <div className={styles.uploadButton}>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      className={styles.hidden}
                      onChange={(e) => handleImageChange(e)}
                      ref={inputRef}
                    />
                    <p> image </p>

                    <Image
                      src={EditIcon}
                      alt="edit"
                      className={styles.editIcon}
                      onClick={() => {
                        inputRef.current?.click()
                      }}
                    />
                  </div>

                  <div className={styles.uploadButton}>
                    <p> Video </p>

                    <Image
                      src={EditIcon}
                      alt="edit"
                      className={styles.editIcon}
                      onClick={() => {
                        dispatch(
                          openModal({
                            type: 'upload-video-page',
                            closable: true,
                          }),
                        )
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.uploadButtonDescktop}>
                    <input
                      type="file"
                      accept="image/png, image/gif, image/jpeg"
                      className={styles.hidden}
                      onChange={(e) => handleImageChange(e)}
                      ref={inputRef}
                    />
                    {plusIconSvg}
                    <p>Add Image </p>
                  </div>

                  <div
                    onClick={() => {
                      dispatch(
                        openModal({
                          type: 'upload-video-page',
                          closable: true,
                        }),
                      )
                    }}
                    className={styles.uploadButtonDescktop}
                  >
                    {plusIconSvg}
                    <p>Add Video </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        {/* User About */}
        {/* <PageContentBox
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
        > */}

        {listingModalData?.video_url || listingModalData?.images ? (
          <div className={styles.medias}>
            {listingModalData?.video_url && (
              <div className={styles['videos']}>
                {/* <video
                width="250"
                height="240"
                controls={true}
                className={styles.video}
              >
                <source src={listingModalData?.video_url} type="video/mp4" />
              </video> */}
                <ReactPlayer
                  width="100%"
                  height="100%"
                  url={listingModalData?.video_url}
                  controls={true}
                />
              </div>
            )}
          </div>
        ) : (
          listingLayoutMode !== 'edit' && (
            <section className={`${styles['dual-section-wrapper']}`}>
              <div className={styles['no-posts-div']}>
                <p className={styles['no-posts-text']}>No media available</p>
              </div>
              {!isMobile&&<div className={styles['no-posts-div']}></div>}
            </section>
          )
        )}
        {listingModalData.images?.map((item: any, idx) => {
          return (
            <div key={idx} className={styles.medias}>
              <div
                key={idx}
                className={styles.image}
                onClick={() => OpenMediaImage(item)}
              >
                <img src={item} />
              </div>
            </div>
          )
        })}

        {/* </PageContentBox> */}

        {/* User Information */}
      </main>
    </>
  )
}

export default ListingMediaTab
