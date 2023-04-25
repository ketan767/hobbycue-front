import React from 'react'
import { useEffect, useState } from 'react'
import styles from '../../styles/HobbyDetail.module.css'

import { getAllHobbies } from '@/services/hobbyService'

import profile from '../../assets/temp/hooby-profile.png'
import cover from '../../assets/temp/hobby-cover.png'
import mailSvg from '../../Assets/Icons/mail.svg'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import PageContentBox from '@/components/PageContentBox'
import PageGridLayout from '@/components/_layouts/PageGridLayout'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

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
      {/* Page Header  */}
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
          {/* Send Email Button  */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MailOutlineRoundedIcon color="primary" />
          </div>

          {/* Bookmark Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <BookmarkBorderRoundedIcon color="primary" />
          </div>

          {/* Share Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <ShareRoundedIcon color="primary" fontSize="small" />
          </div>

          {/* More Options Button */}
          <div onClick={(e) => console.log(e)} className={styles['action-btn']}>
            <MoreHorizRoundedIcon color="primary" />
          </div>
        </div>
      </header>

      {/* Tabs */}
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

      {/* Body / Main Content */}
      <PageGridLayout column={3}>
        <aside>
          <PageContentBox showEditButton={false}>
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
          </PageContentBox>
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

          {/* About Section */}
          <PageContentBox showEditButton={false}>
            <h4>About</h4>
            <div>{data?.description}</div>
          </PageContentBox>

          {/* Keywords Section */}
          {data?.keywords?.length > 0 && (
            <PageContentBox showEditButton={false}>
              <h4>Keywords :</h4>
              <ul className={styles['keyword-list']}>
                {data?.keywords?.map((item: any, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </PageContentBox>
          )}

          {/* Next Levels and Related Hobbies */}
          <section
            style={{ display: 'flex', gap: '24px', alignItems: 'start' }}
            className={styles['']}
          >
            {/* Next Levels */}
            <PageContentBox showEditButton={false}>
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
            </PageContentBox>

            {/* Related Hobbies */}
            <PageContentBox showEditButton={false}>
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
            </PageContentBox>
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
      </PageGridLayout>
    </section>
  )
}

export default HobbyDetail
