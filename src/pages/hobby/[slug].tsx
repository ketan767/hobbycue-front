import React from 'react'
import { useEffect, useState } from 'react'
import styles from '../../styles/HobbyDetail.module.css'

import { getAllHobbies } from '@/services/hobbyService'

import profile from '../../assets/png/hooby-profile.png'
import cover from '../../assets/png/hobby-cover.png'
import mailSvg from '../../Assets/Icons/mail.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import PageContentWrapper from '@/components/PageContentWrapper'

type Props = {}

const HobbyDetail: React.FC<Props> = (props) => {
  const router = useRouter()

  const { slug } = router.query

  const [data, setData]: any = useState({})
  const [nextLevels, setNextLevels] = useState([])

  useEffect(() => {
    if (!data) return
    let query
    if (data.level === 0) query = `category=${data?._id}&level=1&level=2`
    if (data.level === 1)
      query = `category=${data?.category?._id}&sub_category=${data?._id}&level=2&level=3`
    if (data.level === 2)
      query = `category=${data?.category?._id}&sub_category=${data?.sub_category?._id}&level=3`
    if (data.level === 3) query = `genre=${data?.sub_category?._id}&level=5`

    if (!query) return
    getAllHobbies(`fields=display,slug&sort=level&${query}`, (err, res) => {
      if (err) return router.push('/hobby')
      setNextLevels(res.data?.hobbies)
    })
  }, [data])

  useEffect(() => {
    if (!slug) {
      router.push('/hobby')
      return
    }
    getAllHobbies(
      `slug=${slug}&populate=category,sub_category,tags,related_hobbies`,
      (err, res) => {
        if (err) return router.push('/hobby')
        if (res.data?.no_of_hobbies === 0) return
        setData(res.data?.hobbies?.[0])
      },
    )
  }, [slug])

  return (
    <section>
      <header className={`site-container ${styles['header']}`}>
        <Image className={styles['profile-img']} src={profile} alt="" />
        <section className={styles['center-container']}>
          <Image className={styles['cover-img']} src={cover} alt="" />
          <h1 className={styles['name']}>{data?.display}</h1>
          <p className={styles['category']}>
            {data?.level === 0
              ? 'Category'
              : data?.level === 1
              ? 'Sub-Category'
              : data?.level === 2
              ? 'Hobby Tag'
              : data?.level === 3
              ? 'Hobby'
              : data?.level === 5
              ? 'Genre/Style'
              : 'Hobby'}
          </p>
        </section>
        <div className={styles['action-btn-wrapper']}>
          {/* <Tooltip
            title="Mail"
            // classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          >
            <div onClick={(e) => console.log(e)} className={styles["action-btn"]}>
              <img src={mailSvg} alt=""></img>
            </div>
          </Tooltip>
          <Tooltip
            title="Bookmark"
            // classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          >
            <div onClick={(e) => console.log(e)} className={styles["action-btn"]}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0H2C0.9 0 0 0.9 0 2V18L7 15L14 18V2C14 0.9 13.1 0 12 0ZM12 15L7 12.82L2 15V3C2 2.45 2.45 2 3 2H11C11.55 2 12 2.45 12 3V15Z" fill="#8064A2" />
              </svg>
            </div>
          </Tooltip>
          <Tooltip
            title="Share"
            // classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          >
            <div onClick={(e) => console.log(e)} className={styles["action-btn"]}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx={12} cy={12} r="11.25" fill="#F7F5F9" stroke="#8064A2" strokeWidth="1.5" />
                <g clipPath="url(#clip0_5455_25628)">
                  <path
                    d="M13.3333 9.99997V8.93997C13.3333 8.34664 14.0533 8.04664 14.4733 8.46664L17.5333 11.5266C17.7933 11.7866 17.7933 12.2066 17.5333 12.4666L14.4733 15.5266C14.0533 15.9466 13.3333 15.6533 13.3333 15.06V13.9333C10 13.9333 7.66667 15 6 17.3333C6.66667 14 8.66667 10.6666 13.3333 9.99997Z"
                    fill="#8064A2"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5455_25628">
                    <rect width={16} height={16} fill="white" transform="matrix(-1 0 0 1 20 4)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </Tooltip>
          <Tooltip
            title="More"
            // classes={{ tooltip: classes.customTooltip, arrow: classes.customArrow }}
          >
            <div onClick={(e) => console.log(e)} className={styles["action-btn"]}>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 -3.93402e-08 14 -8.74228e-08C12.9 -1.35505e-07 12 0.9 12 2ZM10 2C10 0.9 9.1 -3.01609e-07 8 -3.49691e-07C6.9 -3.97774e-07 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2ZM4 2C4 0.899999 3.1 -5.63877e-07 2 -6.11959e-07C0.9 -6.60042e-07 -3.93403e-08 0.899999 -8.74228e-08 2C-1.35505e-07 3.1 0.899999 4 2 4C3.1 4 4 3.1 4 2Z"
                  fill="#8064A2"
                />
              </svg>
            </div>
          </Tooltip> */}
        </div>
      </header>

      <div className={styles['navigation-links']}>
        <a href="#" className={styles['active']}>
          About
        </a>
        <a href="#">Posts</a>
        <a href="#">Links</a>
        <a href="#">Links</a>
        <a href="#">Store</a>
        <a href="#">Blogs</a>
      </div>

      <section className={` ${styles['body']}`}>
        <div className="site-container">
          <div className={styles['grid-container']}>
            <aside>
              <PageContentWrapper>
                <h4 className={styles['heading']}>Hobbies Classification</h4>
                <ul className={styles['classification-items']}>
                  <Link href={`/hobby/${data?.category?.slug}`}>
                    <li>{data?.category?.display}</li>
                  </Link>
                  <Link href={`/hobby/${data?.sub_category?.slug}`}>
                    <li>{data?.sub_category?.display}</li>
                  </Link>
                  {data?.tags &&
                    data?.tags.map((tag: any, idx: number) => {
                      return (
                        <Link key={idx} href={`/hobby/${tag?.slug}`}>
                          <li>{tag.display}</li>
                        </Link>
                      )
                    })}
                  <li className={styles['active']}>{data?.display}</li>
                </ul>
              </PageContentWrapper>
            </aside>

            <main>
              {/* <div className={styles['start-post-btn']}>
                <button>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M11.1429 6.85745H6.85714V11.1432C6.85714 11.6146 6.47143 12.0003 6 12.0003C5.52857 12.0003 5.14286 11.6146 5.14286 11.1432V6.85745H0.857143C0.385714 6.85745 0 6.47173 0 6.00031C0 5.52888 0.385714 5.14316 0.857143 5.14316H5.14286V0.857448C5.14286 0.386019 5.52857 0.000305176 6 0.000305176C6.47143 0.000305176 6.85714 0.386019 6.85714 0.857448V5.14316H11.1429C11.6143 5.14316 12 5.52888 12 6.00031C12 6.47173 11.6143 6.85745 11.1429 6.85745Z"
                      fill="#8064A2"
                    />
                  </svg>
                  <span>Start a post</span>
                </button>
              </div> */}

              <PageContentWrapper>
                <h4>About</h4>
                <div>{data?.description}</div>
              </PageContentWrapper>

              {data?.keywords?.length > 0 && (
                <PageContentWrapper>
                  <h4>Keywords :</h4>
                  <ul className={styles['keyword-list']}>
                    {data?.keywords?.map((item: any, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </PageContentWrapper>
              )}

              <section
                style={{ display: 'flex', gap: '24px', alignItems: 'start' }}
                className={styles['']}
              >
                <PageContentWrapper>
                  <h4>
                    {data?.level === 0
                      ? 'Sub-Categories'
                      : data?.level === 1
                      ? 'Hobbies'
                      : data?.level === 2
                      ? 'Hobbies'
                      : data?.level === 3
                      ? 'Genre/Styles'
                      : data?.level === 5
                      ? 'Next Level'
                      : 'Next Level'}
                  </h4>
                  <div>
                    {data.level !== 5 && nextLevels.length > 0 ? (
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
                      <span>No further sub-classification.</span>
                    )}
                  </div>
                </PageContentWrapper>

                <PageContentWrapper>
                  <h4>Related</h4>
                  <div>
                    {data?.related_hobbies?.length > 0 ? (
                      <>
                        <ul className={styles['items']}>
                          {data?.related_hobbies?.map((item: any, idx: number) => {
                            return (
                              <Link href={`/hobby/${item.slug}`} key={idx}>
                                <li>{item.display}</li>
                              </Link>
                            )
                          })}
                        </ul>
                      </>
                    ) : (
                      <span>No further information.</span>
                    )}
                  </div>
                </PageContentWrapper>
              </section>
            </main>

            <aside>
              <div className={styles['members']}>
                <h4 className={styles['heading']}>Members</h4>
                <hr />
                <div className={styles['member-list']}>
                  {['Aditya', 'Prince', 'Devansh', 'Someone'].map((name: any, idx: number) => (
                    <p key={idx}>{name}</p>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </section>
  )
}

export default HobbyDetail
