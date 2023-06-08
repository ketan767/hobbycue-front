import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'

import styles from './styles.module.css'
import { RootState } from '@/redux/store'
import TimeIcon from '../../../assets/svg/Time.svg'
import FacebookIcon from '../../../assets/svg/Facebook.svg'
import TwitterIcon from '../../../assets/svg/Twitter.svg'
import InstagramIcon from '../../../assets/svg/Instagram.svg'
import axios from 'axios'
import { getPages, updateListing } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import PostCard from '@/components/PostCard/PostCard'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { uploadImage } from '@/services/post.service'

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

  console.log('imgs', listingModalData.images)
  return (
    <>
      <main>
        <div className={styles.uploadContainer}>
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
        </div>
        {/* User About */}
        {/* <PageContentBox
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
        > */}
        <PageGridLayout column={2}>
          {listingModalData?.video_url && (
            <div>
              <video width="250" height="240" controls={true} className={styles.video}>
                <source src={listingModalData?.video_url} type="video/mp4" />
              </video>
            </div>
          )}
          {listingModalData.images?.map((item: any, idx) => {
            return (
              <div key={idx} className={styles.image}>
                <img src={item} />
              </div>
            )
          })}
          <div></div>
        </PageGridLayout>
        {/* </PageContentBox> */}

        {/* User Information */}
      </main>
    </>
  )
}

export default ListingMediaTab
