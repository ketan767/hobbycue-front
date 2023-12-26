import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch, useSelector } from 'react-redux'

import styles from './ListingHomeTab.module.css'
import { RootState } from '@/redux/store'
import TimeIcon from '../../../assets/svg/Time.svg'
import FacebookIcon from '../../../assets/svg/Facebook.svg'
import TwitterIcon from '../../../assets/svg/Twitter.svg'
import InstagramIcon from '../../../assets/svg/Instagram.svg'
import { getPages } from '@/services/listing.service'
import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import PostCard from '@/components/PostCard/PostCard'
import ListingPagePosts from '../ListingPagePosts/ListingPagePosts'

interface Props {
  data: ListingPageData['pageData']
  AboutErr?: boolean
}

const ListingHomeTab: React.FC<Props> = ({ data, AboutErr }) => {
  // console.log('🚀 ~ file: ListingHomeTab.tsx:17 ~ data:', data)
  const dispatch = useDispatch()
  const [pagesData, setPagesData] = useState([])
  const [showOthers, setShowOthers] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    // const id = user?.activeProfile?.data?._id
    const id = data?._id
    getPages(id)
      .then((res: any) => {
        let allPosts = res.res.data.data.posts
        allPosts = allPosts.map((post: any) => {
          if (post._id === data.pinned_post) {
            return { ...post, isPinned: true }
          } else {
            return post
          }
        })
        allPosts = allPosts.sort((x: any) => (x.isPinned ? -1 : 1))
        setPagesData(allPosts)
      })
      .catch((err) => {
        console.log('err', err.response)
      })
  }, [])

  return (
    <>
      <main>
        {/* User About */}
        <PageContentBox
          className={AboutErr ? styles.errorBorder : ''}
          showEditButton={listingLayoutMode === 'edit'}
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
          setDisplayData={setShowAbout}
        >
          <h4>About</h4>
          <div
            className={`${styles['about-text']} ${styles['display-desktop']}${
              showAbout ? ' ' + styles['display-mobile'] : ''
            }`}
            dangerouslySetInnerHTML={{ __html: data?.description }}
          ></div>
        </PageContentBox>

        {/* User Information */}
        <PageContentBox
          showEditButton={listingLayoutMode === 'edit'}
          onEditBtnClick={() =>
            dispatch(
              openModal({ type: 'listing-general-edit', closable: true }),
            )
          }
          setDisplayData={setShowOthers}
        >
          <h4 className={styles['display-mobile']}>Other Information</h4>
          <div
            className={`${styles['other-data-wrapper']} ${
              showOthers ? ' ' + styles['other-data-wrapper-mobile'] : ''
            }`}
          >
            <h4>Profile URL</h4>
            <div className={styles.textGray}>{data?.page_url}</div>
            {data?.gender && (
              <>
                <h4>Gender</h4>
                <div className={styles.textGray}>{data?.gender}</div>
              </>
            )}
            {data?.year && (
              <>
                <h4>Year</h4>
                <div className={styles.textGray}>{data?.year}</div>
              </>
            )}
            {data?.admin_note && (
              <>
                <h4>Notes</h4>
                <div className={styles.textGray}>{data?.admin_note}</div>
              </>
            )}
          </div>
        </PageContentBox>
        <div className={styles['display-desktop']}>
          <ListingPagePosts data={data} hideStartPost={true} />
        </div>
      </main>
    </>
  )
}

export default ListingHomeTab
