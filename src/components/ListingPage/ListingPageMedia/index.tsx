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
import { getPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import PostCard from '@/components/PostCard/PostCard'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { uploadImage } from '@/services/post.service'

interface Props {
  data: ListingPageData['pageData']
}

const ListingMediaTab: React.FC<Props> = ({ data }) => {
  console.log('data:', data)
  const dispatch = useDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  const [pagesData, setPagesData] = useState([])
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)
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


  // console.log(media)
  return (
    <>
      <main>
        {/* <div className={styles.uploadContainer}>
          <div className={styles.uploadButton}>
            <p> image </p>
            <Image src={EditIcon} alt="edit" className={styles.editIcon} onClick={() => {
               dispatch(
                openModal({
                  type: 'upload-video-page',
                  closable: true,
                }),
              )
            }} />
      
          </div>
          <div className={styles.uploadButton}>
            <p> Video </p>
            <Image src={EditIcon} alt="edit" className={styles.editIcon} onClick={() => {
               dispatch(
                openModal({
                  type: 'upload-video-page',
                  closable: true,
                }),
              )
            }} />
          </div>
        </div> */}
        {/* User About */}
        {/* <PageContentBox
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
        > */}
        <PageGridLayout column={2}>
          {media.map((item: any, idx) => {
            return (
              <div key={idx} className={styles.image}>
                {item.type === 'video' ? (
                  <video width="320" height="240" controls={true}>
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={item.src} />
                )}
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
