import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import { isMobile, pageType } from '@/utils'
import Link from 'next/link'
import { getListingPages } from '@/services/listing.service'

type PropsInterestedDiv = {
  seeMoreWhatsNew: boolean
  setSeeMoreWhatsNew: React.Dispatch<React.SetStateAction<boolean>>
}

const InterestedDiv: React.FC<PropsInterestedDiv> = ({
  seeMoreWhatsNew,
  setSeeMoreWhatsNew,
}) => {
  const whatsNewContainerRef = useRef<HTMLDivElement>(null)
  const [whatsNew, setWhatsNew] = useState([])
  // const [seeMoreWhatsNew, setSeeMoreWhatsNew] = useState(true)
  const isMob = isMobile()

  function getClassName(type: any) {
    if (type === 'user') {
      return 'default-user-icon'
    } else if (type === 1) {
      return 'default-people-listing-icon'
    } else if (type === 2) {
      return 'default-place-listing-icon'
    } else if (type === 3) {
      return 'default-program-listing-icon'
    } else if (type === 4) {
      return 'default-product-listing-icon'
    } else if (type === 'listing') {
      return 'default-people-listing-icon'
    }
  }

  const fetchWhatsNew = async () => {
    const { res, err } = await getListingPages(
      `sort=-createdAt&limit=15&is_published=true`,
    )
    if (res?.data) {
      setWhatsNew(res.data.data.listings)
      setSeeMoreWhatsNew(res.data.data.listings?.length > 3 ? true : false)
    }
  }

  useEffect(() => {
    fetchWhatsNew()
  }, [])

  return (
    <div
      className={styles.interestDiv}
      ref={whatsNewContainerRef}
      //   className={styles['desktop-members-conatiner']}
    >
      <h1 className="">You may be interested in</h1>
      <div className={styles.mainContent}>
        <div className={styles.memberParent}>
          {whatsNew
            ?.slice(0, seeMoreWhatsNew ? 3 : whatsNew.length)
            .map((obj: any, idx) => (
              <div key={idx} className={styles['member']}>
                <Link
                  href={`/${pageType(obj?.type)}/${obj.page_url}`}
                  className={styles['img-name-listing']}
                >
                  {obj?.profile_image ? (
                    <img src={obj.profile_image} />
                  ) : (
                    <div
                      className={
                        getClassName(obj?.type) + ` ${styles['defaultImg']}`
                      }
                    ></div>
                  )}

                  <p>{obj?.title}</p>
                </Link>
              </div>
            ))}
        </div>
        <div className="">
          {whatsNew.length > 3 && (
            <div
              onClick={() => {
                setSeeMoreWhatsNew((prev) => !prev)
              }}
              className={styles['see-all']}
            >
              <p>{seeMoreWhatsNew ? 'See more' : 'See less'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InterestedDiv
