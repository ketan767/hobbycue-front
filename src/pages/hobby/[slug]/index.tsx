import React from 'react'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies } from '@/services/hobby.service'

import { useRouter } from 'next/router'
import Link from 'next/link'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import HobbyPageLayout from '@/layouts/HobbyPageLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = { data: { hobbyData: any } }

const HobbyDetail: React.FC<Props> = (props) => {
  const router = useRouter()

  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [data, setData]: any = useState(props.data.hobbyData)
  const [nextLevels, setNextLevels] = useState([])

  const fetchAndUpdateNextLevels = async (q: string) => {
    const { err, res } = await getAllHobbies(q)
    if (err) return router.push('/hobby')
    setNextLevels(res.data?.hobbies)
  }

  const fetchData = async () => {
    const { err, res } = await getAllHobbies(
      `slug=${router.query.slug}&populate=category,sub_category,tags,related_hobbies`,
    )
    if (err) return

    if (res?.data.success && res.data.no_of_hobbies === 0) return
    if(res.data.hobbies[0]){
      setData(res.data.hobbies[0])
    }
  }

  useEffect(() => {
    fetchData()
  }, [router.asPath])

  /** Get Next Levels */
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

    fetchAndUpdateNextLevels(`fields=display,slug&sort=level&${query}`)
  }, [data])

  return (
    <HobbyPageLayout activeTab="about" data={data}>
      {/* Body / Main Content */}

      <main>
        {/* About Section */}
        <PageContentBox showEditButton={false}>
          <h4>About</h4>
          <div>{data?.description}</div>
        </PageContentBox>

        {/* Keywords Section */}
        {data?.keywords?.length > 0 && (
          <PageContentBox showEditButton={false}>
            <div className={styles['keyword-container']}>
              <h4 className={styles['keyword-text']}>Keyword :</h4>
              <ul className={styles['keyword-list']}>
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
    </HobbyPageLayout>
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
    hobbyData: res.data?.hobbies?.[0],
  }
  return {
    props: {
      data,
    },
  }
}

export default HobbyDetail
