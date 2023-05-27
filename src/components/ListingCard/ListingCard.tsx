import React from 'react'
import styles from './ListingCard.module.css'
import Link from 'next/link'
import Image from 'next/image'
import LocationIcon from '../../assets/svg/location.svg'
import HobbyIcon from '../../assets/svg/hobby.svg'

type Props = {
  data: any
}

const ListingCard: React.FC<Props> = ({ data }) => {
  console.log('🚀 ~ file: ListingCard.tsx:13 ~ data:', data)
  return (
    <>
      <Link
        key={data._id}
        href={`/page/${data.page_url}`}
        className={styles.container}
      >
        <div className={styles.imgContainer}>
          {data.cover_image ? (
            <Image
              src={data.cover_image}
              width={300}
              height={100}
              alt="cover"
              className={styles.coverImage}
            />
          ) : (
            <div
              className={`${styles['coverImage']} default-people-listing-cover`}
            ></div>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.contentHead}>
            {data.profile_image ? (
              <Image
                src={data.profile_image}
                width={48}
                height={48}
                alt="cover"
                className={styles.contentImage}
              />
            ) : (
              <div
                className={`${styles['contentImage']} default-people-listing-icon`}
              ></div>
            )}
            <div className={styles.contentTitle}>
              <p className={styles.title}> {data.title} </p>
              <p className={styles.titleType}>
                {' '}
                {data._address?.city} {', '} {data._address?.country}{' '}
              </p>
            </div>
          </div>

          <p className={styles.tagline}> {data.tagline} </p>

          <div className={styles.bottom}>
            <Image src={LocationIcon} width={16} height={16} alt="location" />
            <p className={styles.location}>
              {data._address?.street} {', '} {data._address?.state}
            </p>
          </div>
          <div className={styles.bottom}>
            <Image src={HobbyIcon} width={16} height={16} alt="hobby" />
            <div className={styles.location}>
              {data?._hobbies?.map((item: any) => {
                return (
                  <span className={styles.hobby} key={item._id}>
                    {item.hobby.display}
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
