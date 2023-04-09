import { withAuth } from '@/navigation/withAuth'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from '../../styles/Profile.module.css'
import Link from 'next/link'
import PageContentBox from '@/components/PageContentBox'
import Image from 'next/image'
import profile from '../../assets/temp/user-profile.webp'
import cover from '../../assets/temp/user-cover.jpg'
import PageGridLayout from '@/components/_layouts/PageGridLayout'

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'

type Props = {}

const Profile: React.FC<Props> = (props) => {
  const router = useRouter()

  const { profile_url } = router.query

  const [data, setData]: any = useState({
    description: `She is born on 25 November 1980 in Delhi. Namrata Pamnani received her training in Kathak under Bharati Gupta and Jaikishan Maharaj at Kathak Kendra, New Delhi. 
    She has also studied Hindustani music and obtained a diploma from Prayag Samiti. She is the recipient of a scholarship from the Ministry of Culture, Government of India. She also received a fellowship from Sanskriti Foundation. She has performed extensively in various dance festivals including Kathak Mahotsava, Konark Festival, Pandit Lacchu Maharaj Utsav, Natya Vriksha Festival, Taj Mahotsava, Kathak Yatra, Kalakshetra Festival, and Nritya Pratibha.`,
  })

  return (
    <>
      <section>
        <header className={`site-container ${styles['header']}`}>
          <Image className={styles['profile-img']} src={profile} alt="" />
          <section className={styles['center-container']}>
            <Image className={styles['cover-img']} src={cover} alt="" />
            <h1 className={styles['name']}>{'Devansh Soni'}</h1>
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

        <div className={styles['navigation-tabs']}>
          <a href="#" className={styles['active']}>
            Home
          </a>
          <a href="#">Posts</a>
          <a href="#">Media</a>
          <a href="#">Pages</a>
          <a href="#">Blogs</a>
        </div>

        {/* Body / Main Content */}
        <PageGridLayout column={3}>
          <aside>
            {/* User Hobbies */}
            <PageContentBox>
              <h4 className={styles['heading']}>Hobbies</h4>
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
            {/* User About */}
            <PageContentBox>
              <h4>About</h4>
              <div>{data?.description}</div>
            </PageContentBox>

            {/* User Information */}
            <PageContentBox>
              <h4>Profile URL</h4>
              <div>{`URL of your listing page`}</div>
              <h4>Year Of Birth</h4>
              <div>{`1994`}</div>
            </PageContentBox>
          </main>

          <aside>
            {/* User Locations */}
            <PageContentBox>
              <h4 className={styles['heading']}>Locations</h4>
              <div></div>
            </PageContentBox>
            {/* User Contact Details */}
            <PageContentBox>
              <h4 className={styles['heading']}>Contact Information</h4>
              <div></div>
            </PageContentBox>
          </aside>
        </PageGridLayout>
      </section>
    </>
  )
}

export default withAuth(Profile)
