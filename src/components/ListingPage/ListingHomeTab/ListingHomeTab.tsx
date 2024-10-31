import React, { use, useEffect, useState } from 'react'
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
import { listingData } from '@/components/_modals/EditListing/ListingRelated/data'

interface Props {
  data: ListingPageData['pageData']
  AboutErr?: boolean
  expandAll?: boolean
}

const ListingHomeTab: React.FC<Props> = ({ data, AboutErr, expandAll }) => {
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

  useEffect(() => {
    if (expandAll !== undefined) {
      setShowAbout(expandAll)
      setShowOthers(expandAll)
    }
  }, [expandAll])

  return (
    <>
      <main>
        {/* Page About */}
        <div className={styles['display-desktop']}>
          <PageContentBox
            className={AboutErr ? styles.errorBorder : ''}
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal(
                  data.type === 4
                    ? {
                        type: 'listing-about-edit',
                        closable: true,
                        propData: 'productDescription',
                      }
                    : { type: 'listing-about-edit', closable: true },
                ),
              )
            }
          >
            <h4>{data.type === 4 ? 'Description' : 'About'}</h4>
            <div className={`ql-snow`}>
              <div
                className={`ql-editor ${styles['ql-editor']}`}
                dangerouslySetInnerHTML={
                  data.type === 4
                    ? { __html: data?.about }
                    : { __html: data?.description }
                }
              ></div>
            </div>
          </PageContentBox>
        </div>

        {/* User Information */}
        <div
          className={
            !(listingLayoutMode === 'edit')
              ? styles['display-none']
              : styles['display-desktop']
          }
        >
          <PageContentBox
            showEditButton={listingLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'listing-general-edit', closable: true }),
              )
            }
            setDisplayData={setShowOthers}
            expandData={expandAll}
          >
            <h4 className={styles['display-mobile']}>Other Information</h4>
            <div
              className={`${styles['other-data-wrapper']} ${
                showOthers ? ' ' + styles['other-data-wrapper-mobile'] : ''
              }`}
            >
              <h4>Page URL</h4>
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
        </div>
      </main>
    </>
  )
}

export default ListingHomeTab
