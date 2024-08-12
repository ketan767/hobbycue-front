import { GetServerSideProps } from 'next'
import { getAllBlogs } from '@/services/blog.services'
import styles from './../styles.module.css'
import BlogComments from './Comments'
import { dateFormat, dateFormatwithYear } from '@/utils'
import Image from 'next/image'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  data: {
    blog_url?: any
  }
}

const BlogPage: React.FC<Props> = ({ data }) => {
  const blogUrl = data?.blog_url?.url || ''

  console.warn('blogdataaaaaaaa', data)
  return (
    <>
      <Head>
        <meta property="og:image" content={`${data?.blog_url?.cover_pic}`} />
        <meta
          property="og:image:secure_url"
          content={`${data?.blog_url?.cover_pic}`}
        />
        <meta
          property="og:description"
          content={`${data?.blog_url?.description ?? ''}`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${data?.blog_url?.title} | HobbyCue`}</title>
      </Head>
      {/* <div className={styles['iframe-container']}>
        <iframe
          className={styles['iframe']}
          src={`https://blog.hobbycue.com/blog/${blogUrl}`}
        ></iframe>
      </div> */}
      <div className={styles['iframe-container']}>
        <div
          className={styles['iframe']}
          dangerouslySetInnerHTML={{ __html: data.blog_url?.content }}
        ></div>
      </div>

      <div className={styles['profile-wrapper']}>
        <div className={`${styles['header-user']}`}>
          {data.blog_url.author?.profile_image ? (
            <Link
              href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
              className={styles.textGray}
            >
              <img
                className={styles['profile-img']}
                src={data.blog_url.author.profile_image}
                alt=""
                width={40}
                height={40}
              />
            </Link>
          ) : (
            <Link
              href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
              className={styles.textGray}
            >
              <Image
                className={styles['profile-img']}
                src={defaultUserImage}
                alt=""
                width={40}
                height={40}
              />
            </Link>
          )}

          <div className={styles['title']}>
            <Link
              href={`/profile/${data.blog_url.author?.profile_url}/blogs`}
              className={styles.textGray}
            >
              <p className={styles['profile-title']}>
                {data.blog_url.author?.full_name}
              </p>
            </Link>
            <p>
              <span>
                {dateFormatwithYear?.format(new Date(data.blog_url?.createdAt))}
              </span>
            </p>
          </div>
        </div>

        <ul className={styles['hobby-list']}>
          {data?.blog_url?._hobbies?.map((item: any) => {
            if (typeof item === 'string') return
            return (
              <Link
                href={`/hobby/${item?.genre?.slug ?? item?.hobby?.slug}/blogs`}
                className={styles.textGray}
                key={item._id}
              >
                {item?.hobby?.display}
                {item?.genre && ` - ${item?.genre?.display} `}
              </Link>
            )
          })}
        </ul>

        <div className={styles['line-with-icon']}>
          <svg
            className={styles['line-svg']}
            width="57"
            height="22"
            viewBox="0 0 57 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              id="Vector"
              d="M38.6605 20.1274C36.299 16.6738 33.1152 14.2768 29.442 12.4691C29.1866 12.3434 29.003 12.3219 28.7719 12.5742C28.3779 13.0044 27.8422 13.0194 27.403 12.6214C27.1602 12.4014 26.978 12.4166 26.7201 12.5489C22.9179 14.4998 19.5966 17.0027 17.3222 20.7112C17.0785 21.1086 16.7616 21.4071 16.2703 21.3498C15.8601 21.302 15.6025 21.0246 15.4981 20.6204C15.4034 20.2541 15.5934 19.969 15.7711 19.6805C17.3239 17.1597 19.362 15.0995 21.7651 13.3909C22.4898 12.8756 23.2405 12.3968 24.0298 11.8674C23.7827 11.7333 23.5647 11.7806 23.3604 11.7806C16.079 11.7787 8.79767 11.7801 1.51632 11.7803C1.19974 11.7803 0.876702 11.808 0.580302 11.662C0.189994 11.4698 -0.0627668 11.1642 0.0136071 10.7158C0.0910086 10.2614 0.379167 9.97582 0.866153 9.94776C1.04419 9.9375 1.22314 9.94142 1.40167 9.94138C8.16718 9.94 14.9327 9.93891 21.6982 9.93779C21.9875 9.93774 22.2768 9.93778 22.5868 9.79924C22.111 9.64463 21.6346 9.49179 21.1595 9.33506C19.9171 8.92522 18.6579 8.55878 17.4377 8.09095C16.0342 7.55284 14.8516 6.69307 14.1397 5.31995C13.0062 3.13363 14.1345 0.751862 16.5365 0.185742C18.6187 -0.305008 20.3583 0.422392 21.9226 1.70373C23.9018 3.32493 25.4868 5.31052 27.005 7.35167C27.0874 7.46237 27.1687 7.57382 27.2881 7.73604C27.8347 7.4324 28.3966 7.28766 28.895 7.87453C29.707 6.85699 30.4807 5.86009 31.2839 4.88768C32.462 3.46157 33.7117 2.09453 35.2752 1.08335C36.7411 0.135278 38.3368 -0.325488 40.0769 0.258804C42.8104 1.17664 43.5039 4.08159 41.5435 6.27736C40.4543 7.49735 39.0339 8.11265 37.5259 8.59197C36.2635 8.99327 35.0028 9.40027 33.6616 9.8303C33.9251 9.98262 34.1394 9.93113 34.3369 9.93102C41.2807 9.92715 48.2245 9.92019 55.1683 9.90949C55.6555 9.90874 55.9746 10.1317 56.079 10.5936C56.1936 11.1008 56.0038 11.4886 55.505 11.6953C55.2396 11.8053 54.9594 11.7823 54.6823 11.7823C47.4605 11.7829 40.2386 11.7829 33.0168 11.783C32.8001 11.783 32.5835 11.783 32.1735 11.783C32.7056 12.13 33.0886 12.3837 33.4755 12.6314C36.1475 14.3413 38.4291 16.4589 40.2129 19.0935C40.4234 19.4044 40.6241 19.7291 40.7746 20.0715C40.9755 20.5289 40.8627 20.9464 40.4189 21.1992C39.9664 21.457 39.5321 21.3913 39.2058 20.9586C39.0152 20.706 38.8569 20.4291 38.6605 20.1274ZM37.2287 2.14007C36.7329 2.3031 36.2897 2.56858 35.8868 2.88987C33.8847 4.48645 32.3224 6.48224 30.808 8.5201C30.7611 8.58323 30.7223 8.65479 30.8153 8.74528C30.8745 8.74528 30.9588 8.76623 31.0274 8.74225C33.437 7.90031 35.9196 7.27731 38.2994 6.35126C39.2739 5.97207 40.1132 5.36995 40.5902 4.37994C41.0451 3.43592 40.6846 2.48549 39.7028 2.09891C38.9119 1.78747 38.1122 1.84435 37.2287 2.14007ZM22.4372 4.74551C21.7296 4.02413 21.0405 3.28412 20.1986 2.7082C19.3157 2.10416 18.3581 1.80653 17.282 1.91607C15.7652 2.07046 15.106 3.3759 15.9103 4.6648C16.4356 5.50651 17.2224 6.03938 18.1287 6.37796C19.1846 6.77246 20.2579 7.12224 21.3313 7.4679C22.7717 7.93175 24.2193 8.37305 25.7899 8.86338C24.7006 7.39272 23.6624 6.04808 22.4372 4.74551Z"
              fill="#CED4DA"
            />
          </svg>
        </div>
      </div>

      <div className={styles['comment-container']}>
        <div className={styles['comment']}>
          <BlogComments data={data.blog_url} />
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllBlogs(
    `url=${query['url']}&populate=author,_hobbies`,
  )

  if (!res || !res.data.success || res.data.data.blog.length === 0) {
    return {
      notFound: true,
    }
  }

  const data = {
    blog_url: res.data.data.blog[0],
  }

  return {
    props: {
      data,
    },
  }
}

export default BlogPage
