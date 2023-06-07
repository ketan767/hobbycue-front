import React, { useEffect, useState } from 'react'
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

interface Props {
  data: ListingPageData['pageData']
}

const ListingPostsTab: React.FC<Props> = ({ data }) => {
  // console.log('data:', data)
  const dispatch = useDispatch()
  const [pagesData, setPagesData] = useState([])
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: RootState) => state)
  // console.log('pagesData', pagesData)

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
          onEditBtnClick={() =>
            dispatch(openModal({ type: 'listing-about-edit', closable: true }))
          }
        >
          {pagesData?.map((page: any) => {
            return <ListingPageCard postData={page} key={page._id} />
          })}
        </PageContentBox>

        {/* User Information */}
      </main>
    </>
  )
}

export default ListingPostsTab
