import React from 'react'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import styles from '@/styles/HobbyDetail.module.css'
import Head from 'next/head'
import { getAllHobbies } from '@/services/hobby.service'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import HobbyPageLayout from '@/layouts/HobbyPageLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { updateHobbyMenuExpandAll } from '@/redux/slices/site'
import { getAllUserDetail } from '@/services/user.service'
import EditIcon from '@/assets/svg/edit-colored.svg'
import { useMediaQuery } from '@mui/material'
import { openModal } from '@/redux/slices/modal'
import { htmlToPlainTextAdv } from '@/utils'

type Props = { data: { hobbyData: any }; unformattedAbout?: string }

const HobbyDetail: React.FC<Props> = (props) => {
  const router = useRouter()
  const [showAbout, setShowAbout] = useState(false)
  const [showKeywords, setShowKeywords] = useState(false)
  const [showNextLevels, setShowNextLevels] = useState(false)
  const [showRelatedHobbies, setShowRelatedHobbies] = useState(false)
  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const dispatch = useDispatch()
  const [showHobby, setShowHobby] = useState(false)
  const [showRelated, setShowRelated] = useState(true)
  const { user, isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [data, setData]: any = useState(props.data.hobbyData)
  const [nextLevels, setNextLevels] = useState([])

  const fetchAndUpdateNextLevels = async (q: string) => {
    const { err, res } = await getAllHobbies(q)
    // if (err) return router.push('/hobby')
    setNextLevels(res?.data?.hobbies)
  }

  const fetchData = async () => {
    const { err, res } = await getAllHobbies(
      `slug=${router.query.slug}&populate=category,sub_category,tags,related_hobbies`,
    )
    if (err) return

    if (res?.data.success && res.data.no_of_hobbies === 0) return
    if (res.data.hobbies[0]) {
      setData(res.data.hobbies[0])
    }
  }

  useEffect(() => {
    fetchData()
  }, [router.asPath])

  useEffect(() => {
    let query = ''
    if (data.level === 0) {
      query = `category=${data?._id}&level=1&level=2`
    } else if (data.level === 1) {
      query = `category=${data?.category?._id}&sub_category=${data?._id}&level=2&level=3`
    } else if (data.level === 2) {
      if (data?.sub_category) {
        query = `level=0&level=1&level=2&level=3&level=5&tags=${data?._id}`
      } else {
        query = `category=${data?.category?._id}&level=3&level=5&tags=${data?._id}`
      }
    }

    if (data.level === 3 && data.genre.length === 0) {
      console.log('expceted condition')
      setNextLevels([])
    } else if (data.level === 3 && data.genre.length !== 0) {
      query = `level=5&genre=${data.genre[0]}`
    }

    if (query) {
      fetchAndUpdateNextLevels(`fields=display,slug&sort=level&${query}`)
    }
  }, [data.level, data.slug, data.tags, router.asPath])

  const displayDescMeta = () => {
    let toReturn = ''
    if (data?.level === 0) {
      toReturn += 'Category'
    } else if (data?.level === 1) {
      toReturn += 'Sub-Category'
    } else if (data?.level === 2) {
      toReturn += 'Hobby Tag'
    } else if (data?.level === 3) {
      toReturn += 'Hobby'
    } else if (data?.level === 5) {
      toReturn += 'Genre/Style'
    } else {
      // toReturn += props?.data?.hobbyData?.description ?? ''
    }

    if (toReturn && props.unformattedAbout) {
      toReturn += ' | '
    }
    if (props.unformattedAbout) {
      toReturn += props.unformattedAbout
    }
    return toReturn
  }

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateHobbyMenuExpandAll(value))
  }

  useEffect(() => {
    // Save scroll position when navigating away from the page
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionhobby', window.scrollY.toString())
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionhobby')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        sessionStorage.removeItem('scrollPositionhobby')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    router.events.on('routeChangeComplete', handleScrollRestoration)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleScrollRestoration)
    }
  }, [])

  useEffect(() => {
    if (expandAll !== undefined) {
      setShowHobby(expandAll)
      setShowKeywords(expandAll)
    }
  }, [expandAll])

  const isMobile = useMediaQuery('(max-width:1100px)')
  console.log('hobbydata', data)
  return (
    <>
      <Head>
        {data?.profile_image ? (
          <>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            />

            <meta property="og:image" content={`${data?.profile_image}`} />

            <meta
              property="og:image:secure_url"
              content={`${data?.profile_image}`}
            />

            <meta property="og:image:alt" content="Profile picture" />
          </>
        ) : (
          ''
        )}
        <meta property="og:description" content={displayDescMeta()} />
        <title>{`${data?.display} | HobbyCue`}</title>
      </Head>
      <HobbyPageLayout
        activeTab="home"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main>
          {/* About Section */}
          {/* <PageContentBox showEditButton={false} setDisplayData={setShowAbout}> */}
          <div className={styles['display-desktop']}>
            <PageContentBox>
              <h4>
                {'About'}{' '}
                {user?.is_admin && (
                  <Image
                    className={styles['pencil-edit']}
                    src={EditIcon}
                    alt="edit"
                    onClick={() =>
                      dispatch(
                        openModal({ type: 'Hobby-about-edit', closable: true }),
                      )
                    }
                  />
                )}
              </h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: data?.description,
                }}
              ></div>
            </PageContentBox>
          </div>

          {/* Keywords Section */}
          {!isMobile && data?.keywords?.length > 0 && (
            <PageContentBox
            // showEditButton={false}
            // setDisplayData={setShowKeywords}
            >
              <div className={styles['keyword-container']}>
                <h4 className={styles['keyword-text']}>Keywords :</h4>
                <ul className={`${styles['keyword-list']}`}>
                  {data?.keywords?.map((item: any, idx: number) => (
                    <li key={idx}>
                      {item} {idx + 1 === data?.keywords.length ? '' : ','}{' '}
                    </li>
                  ))}
                </ul>
              </div>
            </PageContentBox>
          )}

          {/* Next Levels and Related Hobbies */}
          <section style={{}} className={styles['dual-section-wrapper']}>
            {/* Next Levels */}
            {!isMobile && (
              <>
                <PageContentBox
                // showEditButton={false}
                // setDisplayData={setShowNextLevels}
                >
                  <h4>
                    {data?.level === 0
                      ? 'Sub-Categories and Tags'
                      : data?.level === 1
                      ? 'Tags and Hobbies'
                      : data?.level === 2
                      ? 'Hobbies'
                      : data?.level === 3
                      ? 'Genre/Styles'
                      : data?.level === 5
                      ? 'Next Level'
                      : 'Next Level'}
                  </h4>
                  <div
                  // className={`${styles['display-desktop']}${
                  //   showNextLevels ? ' ' + styles['display-mobile'] : ''
                  // }`}
                  >
                    {data.level !== 5 && nextLevels?.length > 0 ? (
                      <>
                        <ul className={styles['next-level-items']}>
                          {nextLevels.map((item: any, idx: number) => {
                            return (
                              <Link href={`/hobby/${item.slug}`} key={idx}>
                                <li>{item.display}</li>
                              </Link>
                            )
                          })}
                        </ul>
                      </>
                    ) : (
                      <span style={isMobile ? {marginTop:"16px"} : {}} >No further sub-classification.</span>
                    )}
                  </div>
                </PageContentBox>

                {/* Related Hobbies */}
                <PageContentBox
                // showEditButton={false}
                // setDisplayData={setShowRelatedHobbies}
                >
                  <h4>Related</h4>
                  <div
                  // className={`${styles['display-desktop']}${
                  //   showRelatedHobbies ? ' ' + styles['display-mobile'] : ''
                  // }`}
                  >
                    {data?.related_hobbies?.length > 0 ? (
                      <>
                        <ul className={styles['items']}>
                          {data?.related_hobbies?.map(
                            (item: any, idx: number) => {
                              return (
                                <Link href={`/hobby/${item.slug}`} key={idx}>
                                  <li>{item.display}</li>
                                </Link>
                              )
                            },
                          )}
                        </ul>
                      </>
                    ) : (
                      <span>No further information.</span>
                    )}
                  </div>
                </PageContentBox>
              </>
            )}
            {isMobile && (
              <>
                {/* Hobbies */}
                <PageContentBox
                  showEditButton={false}
                  initialShowDropdown
                  setDisplayData={(arg0: boolean) => {
                    setShowHobby((prev) => {
                      return !prev
                    })
                  }}
                  expandData={showHobby}
                >
                  <h4 className={styles['heading']}>
                    {'Hobbies'}
                    {user?.is_admin && (
                      <Image
                        className={styles['pencil-edit']}
                        src={EditIcon}
                        alt="edit"
                        onClick={() =>
                          router.push(`/admin/hobby/edit/${data?.slug}`)
                        }
                      />
                    )}
                  </h4>
                  <div
                    className={`${styles['display-desktop']}${
                      showHobby ? ' ' + styles['display-mobile'] : ''
                    }`}
                  >
                    <ul className={styles['classification-items']}>
                      {data.level !== 5 && nextLevels?.length > 0 ? (
                        <>
                          <ul className={styles['next-level-items']}>
                            {nextLevels.map((item: any, idx: number) => {
                              return (
                                <Link href={`/hobby/${item.slug}`} key={idx}>
                                  <li>{item.display}</li>
                                </Link>
                              )
                            })}
                          </ul>
                        </>
                      ) : (
                        <span style={isMobile ? {marginTop:"16px"} : {}}>No further sub-classification.</span>
                      )}
                      <li className={styles['active']}></li>
                    </ul>
                  </div>
                </PageContentBox>
              </>
            )}
          </section>
        </main>
      </HobbyPageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllHobbies(
    `slug=${query.slug}&populate=category,sub_category,tags,related_hobbies`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.no_of_hobbies === 0)
    return { notFound: true }

  const data = {
    pageData: null,
    postsData: null,
    mediaData: null,
    listingsData: null,
    blogsData: null,
    hobbyData: res.data?.hobbies?.[0] ?? [],
  }
  const unformattedAbout = htmlToPlainTextAdv(
    res.data?.hobbies?.[0]?.description,
  )

  return {
    props: {
      data,
      unformattedAbout,
    },
  }
}

export default HobbyDetail
