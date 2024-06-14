import React, { useEffect, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/PostPage.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts, getMetadata } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import post, { setActivePost, updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { setShowPageLoader } from '@/redux/slices/site'
import Head from 'next/head'

type Props = {}

const CommunityLayout: React.FC<Props> = ({}) => {
  const router = useRouter()
  const [postId, setPostId] = useState<string | null>(null)

  const getLastIdFromUrl = (url: any) => {
    const urlObj = new URL(url)
    const paths = urlObj.pathname.split('/')
    return paths[paths.length - 1]
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currUrl = window.location.href
      const extractedId = getLastIdFromUrl(currUrl)
      setPostId(extractedId)
      console.log(`Extracted ID: ${extractedId}`)
    }
  }, [])

  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    url: '',
  })

  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)
  const [url, setUrl] = useState('')
  const [linkLoading, setLinkLoading] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postData, setPostData] = useState<any>(null)
  const dispatch = useDispatch()

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_author,_genre,_hobby&_id=${postId}`,
    )

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      setPostData(res.data.data.posts?.[0])
      router.push('/community')
    }
    setIsLoadingPosts(false)
  }

  const openPostmodal = () => {
    dispatch(setActivePost(postData))
    dispatch(openModal({ type: 'post', closable: false }))
  }

  useEffect(() => {
    if (postId) {
      getPost()
    }
  }, [activeProfile, postId])

  useEffect(() => {
    if (postData?.content) openPostmodal()
  }, [postData?.content])

  useEffect(() => {
    if (postData?.has_link) {
      const regex =
        /((https?:\/\/|ftp:\/\/|file:\/\/|www\.)[-A-Z0-9+&@#/%?=~_|!:,.;]*)/gi
      const url = postData?.content.match(regex)
      if (url) {
        setUrl(url[0])
      }
      if (url) {
        setLinkLoading(true)
        getMetadata(url[0])
          .then((res: any) => {
            setMetaData(res?.res?.data?.data.data)
            setLinkLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLinkLoading(false)
          })
      }
    }
  }, [postData])

  useEffect(() => {
    if (postData) {
      setMetaData({
        title: postData._author?.full_name || '',
        description: postData.content.replace(/<img\b[^>]*>/g, '') || '',
        image: metaData.image,
        icon: '',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/post/${postData._id}`,
      })
    }
  }, [postData])

  return (
    <>
      <Head>
        <meta property="og:image" content={`${metaData?.image}`} />
        <meta property="og:image:secure_url" content={`${metaData?.image}`} />
        <meta property="og:description" content={`${metaData?.description}`} />
        <meta property="og:url" content={`${metaData?.url}`} />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${metaData?.title} | HobbyCue`}</title>
      </Head>

      <CommunityPageLayout activeTab="posts" singlePostPage={true}>
        <main>
          {!postData || isLoadingPosts ? (
            <>
              <PostCardSkeletonLoading />
            </>
          ) : (
            <PostCard postData={postData} />
          )}
        </main>
      </CommunityPageLayout>
    </>
  )
}

export default CommunityLayout
