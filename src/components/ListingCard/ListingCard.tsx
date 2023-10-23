import React from 'react'
import styles from './ListingCard.module.css'
import Link from 'next/link'
import Image from 'next/image'
import LocationIcon from '../../assets/svg/location.svg'
import HobbyIcon from '../../assets/svg/hobby.svg'
import { getListingTypeName } from '@/utils'
import People from '@/assets/svg/People.svg'
import Place from '@/assets/svg/Place.svg'
import Program from '@/assets/svg/Program.svg'

type Props = {
  data: any
}

const ListingCard: React.FC<Props> = ({ data }) => {
  // console.log('🚀 ~ file: ListingCard.tsx:13 ~ data:', data)
  // console.log('data', data)
  const type = getListingTypeName(data.type)
  return (
    <>
      <Link
        key={data._id}
        href={`/page/${data.page_url}`}
        className={styles.container}
      >
        <div className={styles.imgContainer}>
          {data?.cover_image ? (
            <Image
              src={data.cover_image}
              width={300}
              height={100}
              alt="cover"
              className={styles.coverImage}
            />
          ) : (
            <div
              className={
                data.type == 1
                  ? `${styles['coverImage']} default-people-listing-cover`
                  : data.type == 2
                  ? `${styles['coverImage']} default-place-listing-cover`
                  : data.type == 3
                  ? `${styles['coverImage']} default-program-listing-cover`
                  : data.type == 4
                  ? `${styles['coverImage']} default-product-listing-cover`
                  : `${styles['coverImage']} default-people-listing-cover`
              }
            ></div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentHead}>
            {data?.profile_image ? (
              <div className={styles.contentImageContainer}>
                <Image
                  src={data.profile_image}
                  width={48}
                  height={48}
                  alt="cover"
                  className={styles.contentImage}
                />
              </div>
            ) : (
              <div
                className={
                  data.type == 1
                    ? `${styles['contentImage']} default-people-listing-icon`
                    : data.type == 2
                    ? `${styles['contentImage']} default-place-listing-icon`
                    : data.type == 3
                    ? `${styles['contentImage']} default-program-listing-icon`
                    : data.type == 4
                    ? `${styles['contentImage']} default-product-listing-icon`
                    : `${styles['contentImage']} default-people-listing-icon`
                }
              ></div>
            )}
            <div className={styles.contentTitle}>
              <p className={styles.title}> {data.title} </p>
              <p className={styles.titleType}>
                <Image
                  src={
                    data.type === 1 ? People : data.type === 2 ? Place : Program
                  }
                  alt="type"
                />
                <p> {data.page_type} </p>
              </p>
            </div>
          </div>

          <p className={styles.tagline}> {data.tagline} </p>

          <div className={styles.bottom}>
            <Image src={LocationIcon} width={16} height={16} alt="location" />
            <p className={styles.location}>
              {data._address?.city} {', '} {data._address?.country}{' '}
            </p>
          </div>
          <div className={styles.bottom}>
            <Image src={HobbyIcon} width={16} height={16} alt="hobby" />
            <div className={styles.location}>
              {data?._hobbies?.map((item: any) => {
                return (
                  <span className={styles.hobby} key={item._id}>
                    {item.hobby?.display}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default ListingCard
