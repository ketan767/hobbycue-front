import { getListingPages, searchPages } from '@/services/listing.service'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'

interface IndexProps {}

const Index: FC<IndexProps> = ({}) => {
  const router = useRouter()
  const { page_url } = router.query
  const [page, setPage] = useState<any>(null)
  useEffect(() => {
    const fetchpageData = async () => {
      const { err, res } = await getListingPages(
        `page_url=${page_url}&populate=_hobbies,_address`,
      )
      setPage(res?.data.data?.listings[0])
    }

    if (page_url) {
      fetchpageData()
    }
  }, [page_url])
  console.log({ page })
  if (!page_url || !page) return <>Loading...</>
  return (
    <AdminLayout>
      <div className={styles.mainWrapper}>
        <h1>Edit page: {page?.title}</h1>
        <form>
          <div className={styles.inputbox}>
            <label>Title</label>
            <input
              type="text"
              value={page?.title}
              onChange={(e) => setPage({ ...page, full_name: e.target.value })}
            />
          </div>
          <div className={styles.inputbox}>
            <label>Tagline</label>
            <input
              type="text"
              value={page?.tagline}
              onChange={(e) => setPage({ ...page, tagline: e.target.value })}
            />
          </div>
          <div className={styles.inputbox}>
            <label>Description</label>
            <textarea
              value={page?.description}
              onChange={(e) =>
                setPage({ ...page, description: e.target.value })
              }
            />
          </div>
          <div className={styles.inputbox}>
            <label>Page Url</label>
            <input
              type="text"
              value={page?.page_url}
              onChange={(e) =>
                setPage({ ...page, profile_url: e.target.value })
              }
            />
          </div>
          <div className={styles.inputbox}>
            <label>Public Email</label>
            <input
              type="text"
              value={page?.public_email}
              onChange={(e) =>
                setPage({ ...page, public_email: e.target.value })
              }
            />
          </div>
          <div className={styles.inputbox}>
            <label>Phone</label>
            <div>
              <input
                className={styles.prefix}
                type="text"
                value={page?.phone.prefix}
                onChange={(e) => setPage({ ...page, prefix: e.target.value })}
              />
              <input
                type="text"
                value={page?.phone.number}
                onChange={(e) => setPage({ ...page, number: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.inputbox}>
            <label>Whatsapp</label>
            <div>
              <input
                className={styles.prefix}
                type="text"
                value={page?.whatsapp_number.prefix}
                onChange={(e) => setPage({ ...page, prefix: e.target.value })}
              />
              <input
                type="text"
                value={page?.whatsapp_number.number}
                onChange={(e) => setPage({ ...page, number: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.inputbox}>
            <label>Year of Birth</label>
            <input
              type="text"
              value={page?.year_of_birth}
              onChange={(e) =>
                setPage({ ...page, year_of_birth: e.target.value })
              }
            />
          </div>
          {/* <div className={styles.inputbox}>
          <label>About</label>
          <textarea
            value={page?.about}
            onChange={(e) => setPage({ ...page, about: e.target.value })}
          />
        </div> */}
          <div className={styles.inputbox}>
            <label>Website</label>
            <input
              type="text"
              value={page?.website}
              onChange={(e) => setPage({ ...page, website: e.target.value })}
            />
          </div>

          <div>
            <h2>Address</h2>
            <div className={styles.longInputContainer}>
              <label>Street</label>
              <input
                type="text"
                value={page?._address?.street}
                onChange={(e) => setPage({ ...page, Street: e.target.value })}
              />
            </div>
            <section className={styles.twoColumnGrid}>
              <div className={styles.Addressinputbox}>
                <label>Society</label>
                <input
                  type="text"
                  value={page?._address?.society}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Locality</label>
                <input
                  type="text"
                  value={page?._address?.locality}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
            </section>
            <section className={styles.twoColumnGrid}>
              <div className={styles.Addressinputbox}>
                <label>City</label>
                <input
                  type="text"
                  value={page?._address?.city}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Pin code</label>
                <input
                  type="text"
                  value={page?._address?.pin_code}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
            </section>
            <section className={styles.twoColumnGrid}>
              <div className={styles.Addressinputbox}>
                <label>State</label>
                <input
                  type="text"
                  value={page?._address?.state}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Country</label>
                <input
                  type="text"
                  value={page?._address?.country}
                  onChange={(e) =>
                    setPage({ ...page, website: e.target.value })
                  }
                />
              </div>
            </section>
          </div>
          <div className={styles.inputbox}>
            <label>Is Onboarded:</label>
            <select
              value={page.is_onboarded.toString()} // Convert boolean to string explicitly
              onChange={(e) => {
                setPage({ ...page, is_onboarded: e.target.value === 'true' })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className={styles.inputbox}>
            <label>Is Published:</label>
            <select
              value={page?.is_published} // Convert boolean to string explicitly
              onChange={(e) => {
                setPage({
                  ...page,
                  is_published: e.target.value === 'true',
                })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className={styles.inputbox}>
            <label>Is Verified:</label>
            <select
              value={page?.is_verified} // Convert boolean to string explicitly
              onChange={(e) => {
                setPage({
                  ...page,
                  is_verified: e.target.value === 'true',
                })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className={styles.inputbox}>
            <label>Is Locked:</label>
            <select
              value={page?.is_locked} // Convert boolean to string explicitly
              onChange={(e) => {
                setPage({
                  ...page,
                  is_locked: e.target.value === 'true',
                })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className={styles.inputbox}>
            <label>Is Claimed:</label>
            <select
              value={page?.is_claimed} // Convert boolean to string explicitly
              onChange={(e) => {
                setPage({
                  ...page,
                  is_claimed: e.target.value === 'true',
                })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  )
}

export default Index
