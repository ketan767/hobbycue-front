import ListingPageCard from '@/components/ListingPageCard/ListingPageCard'
import { getListingPages } from '@/services/listing.service'
import { FC, useEffect, useState } from 'react'
import styles from './ListingRelatedTab.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import PagesLoader from '@/components/PagesLoader/PagesLoader'
import { useMediaQuery } from '@mui/material'

interface ListingRelatedTabProps {
  data: any
}

const ListingRelatedTab: FC<ListingRelatedTabProps> = ({ data }) => {
  const [listingPagesLeft, setListingPagesLeft] = useState([])
  const [loading, setLoading] = useState(true)

  const isMobile = useMediaQuery('(max-width:1100px)')

  useEffect(() => {
    setLoading(true)

    data.forEach((listing: any) => {
      getListingPages(`_id=${listing}`)
        .then((res: any) => {
          const listingData = res.res.data.data.listings[0]
          setListingPagesLeft((prevArray: any) => {
            const updated: any = [...prevArray, listingData]
            const ids = prevArray.map((item: any) => item?._id)
            if (!ids.includes(listingData?._id)) {
              return updated
            } else {
              return prevArray
            }
          })
        })
        .catch((err: any) => {
          console.log(err)
        })
    })

    setLoading(false)
  }, [data])

  if (loading) {
    return (
      <div className={styles.main}>
        <div className={styles['card']}>
          <PagesLoader />
        </div>
        <div className={styles['card']}>
          <PagesLoader />
        </div>
        <div className={styles['card']}>
          <PagesLoader />
        </div>
        <div className={styles['card']}>
          <PagesLoader />
        </div>
      </div>
    )
  }

  if (listingPagesLeft?.length === 0) {
    return (
      <div className={styles['dual-section-wrapper']}>
        <div className={styles['no-posts-container']}>
          <p>No pages available</p>
        </div>
        {!isMobile && <div className={styles['no-posts-container']}></div>}
      </div>
    )
  }

  return (
    <div className={styles.main}>
      {listingPagesLeft?.map((el: any, i: any) => (
        <div className={styles.card}>
          <ListingCard data={el} key={i} />
        </div>
      ))}
    </div>
  )
}

export default ListingRelatedTab
