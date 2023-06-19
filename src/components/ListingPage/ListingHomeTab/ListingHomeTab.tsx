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

interface Props {
  data: ListingPageData['pageData']
}

const ListingHomeTab: React.FC<Props> = ({ data }) => {
  // console.log('🚀 ~ file: ListingHomeTab.tsx:17 ~ data:', data)
  const dispatch = useDispatch()
  const [pagesData, setPagesData] = useState([])

  const { listingLayoutMode } = useSelector((state: RootState) => state.site)

  useEffect(() => {
    // const id = user?.activeProfile?.data?._id
    const id = data?._id
    getPages(id)
      .then((res: any) => {
        console.log('res', res.res)
        setPagesData(res?.res.data?.data.posts)
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
          showEditButton={listingLayoutMode === 'edit'}
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
        >
          <h4>About</h4>
          <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
        </PageContentBox>

        {/* User Information */}
        <PageContentBox
          showEditButton={listingLayoutMode === 'edit'}
          onEditBtnClick={() =>
            dispatch(
              openModal({ type: 'listing-general-edit', closable: true }),
            )
          }
        >
          <h4>Profile URL</h4>
          <div>{data?.page_url}</div>
          <h4>Gender</h4>
          <div>{data?.gender}</div>
          <h4>Year</h4>
          <div>{data?.year}</div>
          <h4>Notes</h4>
          <div>{data?.admin_note}</div>
        </PageContentBox>

        <PageContentBox>
          {pagesData?.map((page: any) => {
            return <PostCard postData={page} key={page._id} />
          })}
        </PageContentBox>
      </main>
    </>
  )
}

export default ListingHomeTab
