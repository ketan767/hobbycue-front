import React, { useEffect, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/PostPage.module.css'
import stylesCommunity from '@/layouts/CommunityPageLayout/CommunityLayout.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts, getMetadata } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import post, {
  setActivePost,
  setFilters,
  updateLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists, validateEmail } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { setShowPageLoader } from '@/redux/slices/site'
import Head from 'next/head'
import hobbycuelogo from '@/assets/image/HobbyCue_v2.png'
import CommunityTopDropdown from '@/components/_formElements/CommunityTopDropdown/CommunityTopDropdown'
import { CommunityDropdownOption } from '@/components/_formElements/CommunityDropdownOption/CommunityDropdownOption'
import PanelDropdownList from '@/layouts/CommunityPageLayout/PanelDropdownList'
import { InviteToCommunity } from '@/services/auth.service'

type Props = {
  data: ListingPageData
}

type singlePostProps = {
  hobbyMembers: any[]
  whatsNew: any[]
  trendingHobbies: any[]
}

const CommunityLayout: React.FC<Props> = ({ data }) => {
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

  const { activeProfile, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const { allPosts, filters } = useSelector((state: RootState) => state.post)
  const [selectedHobby, setSelectedHobby] = useState('All Hobbies')
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>('')
  const [visibilityData, setVisibilityData] = useState([
    { display: 'All Locations', value: 'All Locations' },
  ])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [inviteBtnLoader, setInviteBtnLoader] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postData, setPostData] = useState<any>(null)
  const dispatch = useDispatch()

  const getPost = async () => {
    if (!postId) return

    const params = new URLSearchParams(
      `populate=_author,_genre,_hobby&_id=${postId}`,
    )

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      setPostData(res.data.data.posts?.[0])
    }
    setIsLoadingPosts(false)
    // router.push('/community')
  }

  const htmlToPlainText = (html: string) => {
    if (typeof window !== 'undefined') {
      const element = document.createElement('div')
      element.innerHTML = html
      return element.textContent || ''
    }
    return ''
  }

  const getPreviewimage = () => {
    if (data?.metadata?.data?.image) {
      return data?.metadata?.data?.image
    } else if (
      data?.postsData?.media?.length > 0 &&
      data?.postsData?.media[0]
    ) {
      return data?.postsData?.media[0]
    } else {
      return '/HobbyCue-FB-4Ps.png'
    }
  }

  const post_descripton = htmlToPlainText(data.postsData?.content)
  console.warn('postdesccc', post_descripton)

  useEffect(() => {
    if (postId) {
      getPost()
    }
  }, [activeProfile, postId])

  const updateFilterLocation = (val: any) => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
    dispatch(
      setFilters({
        location: selectedLocation === val ? 'All Locations' : val,
      }),
    )
    setSelectedLocation((prev) => {
      if (prev === val) {
        return 'All Locations'
      } else {
        return val
      }
    })
  }

  const EditProfileLocation = () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (activeProfile?.type === 'user') {
      window.location.href = '/settings/localization-payments'
    } else {
      dispatch(openModal({ type: 'listing-address-edit', closable: true }))
    }
  }

  const editHobbiesClick = () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
    if (activeProfile?.type === 'user') {
      dispatch(
        openModal({
          type: 'profile-hobby-edit',
          closable: true,
        }),
      )
    } else {
      dispatch(
        openModal({
          type: 'listing-hobby-edit',
          closable: true,
        }),
      )
    }
  }

  const handleHobbyClick = async (hobbyId: any, genreId: any) => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (selectedHobby !== hobbyId || selectedGenre !== genreId) {
      dispatch(
        setFilters({
          hobby: hobbyId,
        }),
      )
      setSelectedHobby(hobbyId)
      if (genreId !== '') {
        setSelectedGenre(genreId)
        dispatch(setFilters({ genre: genreId }))
      }

      // Fetch posts for the newly selected hobby
      const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
      if (hobbyId !== 'All Hobbies' || hobbyId !== 'My Hobbies') {
        params.append('_hobby', hobbyId)
      }
      if (genreId !== 'undefined' && genreId !== '') {
        params.append('_genre', genreId)
      }
      dispatch(updateLoading(true))

      dispatch(updateLoading(false))
    } else {
      dispatch(setFilters({ genre: '', hobby: '' }))
      setSelectedHobby('')
      setSelectedGenre('')
      // fetchPosts()
    }
  }

  const hobbiesDropDownArr =
    activeProfile.data?._hobbies?.map((item: any) => ({
      value: item.hobby?._id,
      genreId: item.genre?._id, // Add genre id to the object
      display: `${item.hobby?.display}${item?.genre?.display ? ' - ' : ''}${
        item?.genre?.display ?? ''
      }`,
    })) ?? []

  const DoubleArrowSvg = ({ rotate }: { rotate?: boolean }) => {
    return (
      <svg
        style={{ rotate: rotate === true ? '180deg' : '0deg' }}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M13.75 10.9375L10 14.6875L6.25 10.9375M13.75 5.3125L10 9.0625L6.25 5.3125"
          stroke="#8064A2"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }
  const Invitecommunity = async () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    const to = email
    if (!to || to === '') {
      setErrorMessage('This field is required')
      return
    }
    if (!validateEmail(to)) {
      setErrorMessage('Please enter a valid email')
      return
    }
    setErrorMessage('')
    const name = activeProfile?.data.full_name
    const _id = activeProfile?.data?._id
    const hobby_id = filters?.hobby
    const location = filters?.location || ''
    setInviteBtnLoader(true)

    const { err, res } = await InviteToCommunity({
      to,
      name,
      _id,
      hobby_id,
      location,
    })
    if (res.data?.success) {
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Invitation sent',
      })
      setEmail('')
    }
    if (err) {
      setEmail('')
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'error',
        message: 'Invitation failed.',
      })
    }
  }

  const Children: React.FC<singlePostProps> = ({
    hobbyMembers,
    whatsNew,
    trendingHobbies,
  }) => {
    return (
      <main style={{ paddingBottom: '3.5rem', minHeight: '100vh' }}>
        {!postData || isLoadingPosts ? (
          <>
            <PostCardSkeletonLoading />
          </>
        ) : (
          <>
            <header
              className={`${stylesCommunity['community-header']} ${stylesCommunity['community-header-small']}`}
            >
              <div className={stylesCommunity['community-header-left']}>
                <section className={stylesCommunity['filter-section']}>
                  <div>
                    <CommunityTopDropdown
                      // maxWidth="139px"
                      className={stylesCommunity['hobby-select']}
                      value={
                        hobbiesDropDownArr.find(
                          (obj: any) => obj?.value === selectedHobby,
                        )?.display ?? selectedHobby
                      }
                      variant={selectedHobby === '' ? 'secondary' : 'primary'}
                    >
                      {[
                        { display: 'All Hobbies', value: 'All Hobbies' },
                        { display: 'My Hobbies', value: 'My Hobbies' },
                        ...hobbiesDropDownArr,
                        {
                          display: 'Edit Hobbies',
                          value: '',
                          pencil: true,
                          onClick: editHobbiesClick,
                          smallPencil: true,
                        },
                      ]?.map((item: any, idx) => (
                        <CommunityDropdownOption
                          // maxWidth="139px"
                          {...item}
                          key={idx}
                          currentValue={
                            hobbiesDropDownArr.find(
                              (obj: any) => obj?.value === selectedHobby,
                            )?.value ?? 'All Hobbies'
                          }
                          onChange={(val: any) =>
                            handleHobbyClick(val?.value, item.genreId ?? '')
                          }
                        />
                      ))}
                    </CommunityTopDropdown>

                    <div className={stylesCommunity.hobbyDropDownOption}>
                      in
                    </div>

                    {visibilityData?.length > 0 && (
                      <CommunityTopDropdown
                        value={selectedLocation || ''}
                        variant={
                          selectedLocation === 'All Locations'
                            ? 'secondary'
                            : 'primary'
                        }
                      >
                        {[
                          ...visibilityData,
                          {
                            display: 'Edit Location',
                            value: '',
                            pencil: true,
                            onClick: EditProfileLocation,
                          },
                        ]?.map((item: any, idx) => (
                          <CommunityDropdownOption
                            {...item}
                            key={idx}
                            currentValue={selectedLocation}
                            onChange={(val: any) =>
                              updateFilterLocation(
                                val?.display?.split('-')[0]?.trim(),
                              )
                            }
                          />
                        ))}
                      </CommunityTopDropdown>
                    )}
                  </div>
                  <button
                    onClick={() => setShowPanel((prev) => !prev)}
                    className={stylesCommunity['panel-dropdown-btn']}
                  >
                    <DoubleArrowSvg rotate={showPanel} />
                  </button>
                </section>
                {showPanel && (
                  <section className={stylesCommunity['dropdowns-panel']}>
                    {[
                      {
                        name: 'Hobby Members',
                        options: hobbyMembers,
                        type: 'user members',
                      },
                      {
                        name: "What's New",
                        options: whatsNew,
                        type: 'members',
                        initialOpen: allPosts.length === 0,
                      },
                      {
                        name: 'Trending Hobbies',
                        options: trendingHobbies,
                      },
                    ].map(
                      (
                        obj: {
                          name: string
                          options: any[]
                          type?: string
                          invite?: boolean
                          initialOpen?: boolean
                        },
                        idx: number,
                      ) => (
                        <PanelDropdownList
                          name={obj.name}
                          options={obj.options}
                          key={idx}
                          type={obj?.type}
                          inviteFunction={Invitecommunity}
                          inviteError={errorMessage}
                          inviteTextChangeFunc={(e: any) => {
                            setEmail(e.target.value)
                            setErrorMessage('')
                          }}
                          inviteText={email}
                          invite={obj?.invite}
                          initialOpen={obj?.initialOpen}
                        />
                      ),
                    )}
                  </section>
                )}
              </div>
            </header>
            <PostCard postData={postData} />
          </>
        )}
      </main>
    )
  }

  return (
    <>
      <Head>
        <meta property="og:image" content={getPreviewimage()} />
        <meta property="og:image:secure_url" content={getPreviewimage()} />

        <meta
          property="og:description"
          content={`${
            post_descripton
              ? post_descripton
              : data.metadata?.data?.description
              ? data.metadata?.data?.description
              : 'View this post on hobbycue.com'
          }`}
        />

        <meta property="og:image:alt" content="Profile picture" />
        <title>
          {`${`${
            data?.postsData?.author_type === 'User'
              ? data.postsData?._author?.full_name
              : data.postsData?._author?.title
          } - ${data.postsData?._hobby?.display} at ${
            data.postsData?.visibility
          }`}`}
        </title>
      </Head>
      <CommunityPageLayout activeTab="posts" singlePostPage={true}>
        <Children hobbyMembers={[]} whatsNew={[]} trendingHobbies={[]} />
      </CommunityPageLayout>
    </>
  )
}

export default CommunityLayout

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { params, req } = context

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['host']
  const url = `${protocol}://${host}${req.url}`

  console.log('Current URL:', url)

  // Extract postId and query parameters
  const postId = new URL(url).pathname.split('/').pop()
  const queryParams = new URLSearchParams(
    `populate=_author,_genre,_hobby&_id=${postId}`,
  )
  const { err, res } = await getAllPosts(queryParams.toString())

  let metadata = null
  if (res?.data?.data.posts) {
    const post = res?.data?.data?.posts[0]

    const regex =
      /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
    const urlMatch = post?.content.match(regex)

    if (urlMatch) {
      const url = urlMatch[0]

      try {
        const response = await getMetadata(url)
        metadata = response?.res?.data?.data
      } catch (error) {
        console.error('Failed to fetch metadata', error)
      }
    }
  }

  return {
    props: {
      data: {
        pageData: null,
        postsData: res?.data?.data?.posts[0],
        mediaData: null,
        reviewsData: null,
        eventsData: null,
        storeData: null,
        metadata: metadata,
      },
    },
  }
}
