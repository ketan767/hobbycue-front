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
import { getPages, updateListing } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import PostCard from '@/components/PostCard/PostCard'
import PostWrapper from '@/layouts/PinnedPost/PinnedPost'

interface Props {
  data: ListingPageData['pageData']
  hideStartPost?: boolean
}

const ListingPostsTab: React.FC<Props> = ({ data, hideStartPost }) => {
  const dispatch = useDispatch()
  const [pagesData, setPagesData] = useState([])
  const { listingLayoutMode } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: RootState) => state)

  useEffect(() => {
    fetchPages()
  }, [data])

  const fetchPages = () => {
    const id = data?._id
    getPages(id)
      .then((res: any) => {
        // console.log('res posts -', res.res)
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
        // console.log('err', err.response)
      })
  }
  const onPinPost = async (postId: any) => {
    const id = data?._id
    const { err, res } = await updateListing(id, {
      pinned_post: postId,
    })
    if (err) return console.log(err)
    if (res?.data.success) {
      fetchPages()
    }
  }

  let pinnedPosts = pagesData.filter((item: any) => item.isPinned === true)
  let unpinnnedPosts = pagesData.filter((item: any) => item.isPinned !== true)

  return (
    <>
      <main>
        {/* Posts */}
        {listingLayoutMode === 'edit' && (
          <section
            className={`content-box-wrapper ${styles['start-post-btn-container']}`}
          >
            <button
              onClick={() =>
                dispatch(openModal({ type: 'create-post', closable: true }))
              }
              className={styles['start-post-btn']}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_704_44049)">
                  <path
                    d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                    fill="#8064A2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_704_44049">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Start a post</span>
            </button>
          </section>
        )}
        {pinnedPosts.map((post: any) => {
          return (
            <PostWrapper title="Pinned Post" key={post._id}>
              <PostCard
                key={post._id}
                postData={post}
                fromProfile={true}
                onPinPost={(postId: any) => onPinPost(postId)}
              />
            </PostWrapper>
          )
        })}
        {unpinnnedPosts.length > 0 && (
          <PostWrapper title="Recent Post">
            {unpinnnedPosts.map((post: any) => {
              return (
                <PostCard
                  key={post._id}
                  postData={post}
                  fromProfile={true}
                  onPinPost={(postId: any) => onPinPost(postId)}
                />
              )
            })}
          </PostWrapper>
        )}
        {/* User Information */}
      </main>
    </>
  )
}

export default ListingPostsTab
