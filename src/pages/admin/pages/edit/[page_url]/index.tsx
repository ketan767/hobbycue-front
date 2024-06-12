import { getListingPages, searchPages } from '@/services/listing.service'
import { useRouter } from 'next/router'
import { FC, FormEvent, useEffect, useState } from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import { getAllHobbies } from '@/services/hobby.service'
import {
  updateListingAddressByAdmin,
  updateListingByAdmin,
} from '@/services/admin.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

interface IndexProps {}

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

interface Phone {
  prefix: string
  number: string
}

interface WhatsappNumber {
  prefix: string
  number: string
}

interface Address {
  _id: string
  street: string
  society: string
  locality: string
  city: string
  pin_code: string
  state: string
  country: string
  latitude: string
  longitude: string
}

interface Page {
  _id: string
  title: string
  tagline: string
  description: string
  page_url: string
  public_email: string
  phone: Phone
  whatsapp_number: WhatsappNumber
  year_of_birth: string
  website: string
  _address: Address
  is_onboarded: boolean
  is_published: boolean
  is_verified: boolean
  is_locked: boolean
  is_claimed: boolean
}

const Index: FC<IndexProps> = ({}) => {
  const router = useRouter()
  const { page_url } = router.query

  const [page, setPage] = useState<Page>({
    _id: '',
    title: '',
    tagline: '',
    description: '',
    page_url: '',
    public_email: '',
    phone: { prefix: '', number: '' },
    whatsapp_number: { prefix: '', number: '' },
    year_of_birth: '',
    website: '',
    _address: {
      _id: '',
      street: '',
      society: '',
      locality: '',
      city: '',
      pin_code: '',
      state: '',
      country: '',
      latitude: '',
      longitude: '',
    },
    is_onboarded: false,
    is_published: false,
    is_verified: false,
    is_locked: false,
    is_claimed: false,
  })

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [hobbies, setHobbies] = useState<DropdownListItem[]>([])
  const [genres, setGenres] = useState<DropdownListItem[]>([])
  useEffect(() => {
    const fetchpageData = async () => {
      const { err, res } = await getListingPages(
        `page_url=${page_url}&populate=_hobbies,_address`,
      )
      setPage(res?.data.data?.listings[0])
    }

    if (page_url) {
      fetchpageData()
      getAllHobbies(
        `fields=display,genre&level=3&level=2&level=1&level=0&show=true`,
      )
        .then((res) => {
          setHobbies(res.res.data.hobbies)
        })
        .catch((err) => console.log({ err }))
    }
  }, [page_url])

  const updatePageFunc = async (e: FormEvent) => {
    e.preventDefault()
    const { err, res } = await updateListingByAdmin(page?._id, page)
    if (err) {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    } else if (res) {
      setSnackbar({
        type: 'success',
        display: true,
        message: 'Page updated successfully',
      })
    } else {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    }

    if (page?._address && typeof page._address !== 'string') {
      const { err: addressErr, res: addressRes } =
        await updateListingAddressByAdmin(page._address?._id, page._address)
      if (addressErr) {
        setSnackbar({
          type: 'warning',
          display: true,
          message: 'Error updating address',
        })
        return
      }
    }
  }
  console.log({ page })
  if (!page_url || !page) return <>Loading...</>
  return (
    <>
      <AdminLayout>
        <div className={styles.mainWrapper}>
          <h1>Edit page: {page?.title}</h1>
          <form onSubmit={updatePageFunc}>
            <div className={styles.inputbox}>
              <label>Title</label>
              <input
                type="text"
                value={page?.title}
                onChange={
                  (e) => setPage({ ...page, title: e.target.value }) // Fixed property name to 'title'
                }
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
                onChange={
                  (e) => setPage({ ...page, page_url: e.target.value }) // Fixed property name to 'page_url'
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
                  value={page?.phone?.prefix}
                  onChange={(e) =>
                    setPage({
                      ...page,
                      phone: { ...page.phone, prefix: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  value={page?.phone?.number}
                  onChange={(e) =>
                    setPage({
                      ...page,
                      phone: { ...page.phone, number: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.inputbox}>
              <label>Whatsapp</label>
              <div>
                <input
                  className={styles.prefix}
                  type="text"
                  value={page?.whatsapp_number?.prefix}
                  onChange={(e) =>
                    setPage({
                      ...page,
                      whatsapp_number: {
                        ...page.whatsapp_number,
                        prefix: e.target.value,
                      },
                    })
                  }
                />
                <input
                  type="text"
                  value={page?.whatsapp_number?.number}
                  onChange={(e) =>
                    setPage({
                      ...page,
                      whatsapp_number: {
                        ...page.whatsapp_number,
                        number: e.target.value,
                      },
                    })
                  }
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
                  onChange={(e) =>
                    setPage({
                      ...page,
                      _address: { ...page._address, street: e.target.value },
                    })
                  }
                />
              </div>
              <section className={styles.twoColumnGrid}>
                <div className={styles.Addressinputbox}>
                  <label>Society</label>
                  <input
                    type="text"
                    value={page?._address?.society}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: { ...page._address, society: e.target.value },
                      })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Locality</label>
                  <input
                    type="text"
                    value={page?._address?.locality}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: {
                          ...page._address,
                          locality: e.target.value,
                        },
                      })
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
                      setPage({
                        ...page,
                        _address: { ...page._address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Pin code</label>
                  <input
                    type="text"
                    value={page?._address?.pin_code}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: {
                          ...page._address,
                          pin_code: e.target.value,
                        },
                      })
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
                      setPage({
                        ...page,
                        _address: { ...page._address, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Country</label>
                  <input
                    type="text"
                    value={page?._address?.country}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: { ...page._address, country: e.target.value },
                      })
                    }
                  />
                </div>
              </section>
              <section className={styles.twoColumnGrid}>
                <div className={styles.Addressinputbox}>
                  <label>Latitude</label>
                  <input
                    type="text"
                    value={page?._address?.latitude}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: {
                          ...page._address,
                          latitude: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Longitude</label>
                  <input
                    type="text"
                    value={page?._address?.longitude}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        _address: {
                          ...page._address,
                          longitude: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </section>
            </div>
            <div className={styles.inputbox}>
              <label>Is Onboarded:</label>
              <select
                value={page.is_onboarded?.toString()}
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
                value={page?.is_published?.toString()}
                onChange={(e) => {
                  setPage({ ...page, is_published: e.target.value === 'true' })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
            </div>
            <div className={styles.inputbox}>
              <label>Is Verified:</label>
              <select
                value={page?.is_verified?.toString()}
                onChange={(e) => {
                  setPage({ ...page, is_verified: e.target.value === 'true' })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
            </div>
            <div className={styles.inputbox}>
              <label>Is Locked:</label>
              <select
                value={page?.is_locked?.toString()}
                onChange={(e) => {
                  setPage({ ...page, is_locked: e.target.value === 'true' })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
            </div>
            <div className={styles.inputbox}>
              <label>Is Claimed:</label>
              <select
                value={page?.is_claimed?.toString()}
                onChange={(e) => {
                  setPage({ ...page, is_claimed: e.target.value === 'true' })
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

      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default Index
