// pages/admin/users/[profile_url].tsx

import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { getAllUserDetail } from '@/services/user.service'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { updateUserByAdmin } from '@/services/admin.service'
import { getAllHobbies } from '@/services/hobby.service'

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

const EditUserPage: React.FC = () => {
  const router = useRouter()
  const { profile_url } = router.query
  const [user, setUser] = useState<any>(null)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [hobbies, setHobbies] = useState<DropdownListItem[]>([])
  const [genres, setGenres] = useState<DropdownListItem[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      const { err, res } = await getAllUserDetail(
        `profile_url=${profile_url}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`,
      )
      setUser(res?.data.data?.users[0])
      console.log(res?.data.data?.users)
    }

    if (profile_url) {
      fetchUserData()
      getAllHobbies(
        `fields=display,genre&level=3&level=2&level=1&level=0&show=true`,
      )
        .then((res) => {
          setHobbies(res.res.data.hobbies)
        })
        .catch((err) => console.log({ err }))
    }
  }, [profile_url])

  const updateUserFunc = async (e: FormEvent) => {
    e.preventDefault()
    const { err, res } = await updateUserByAdmin(user._id, user)
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
        message: 'User updated successfully',
      })
    } else {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    }
  }

  if (!profile_url || !user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AdminLayout>
        <div className={styles.mainWrapper}>
          <h1>Edit User: {user?.full_name}</h1>
          <form onSubmit={updateUserFunc}>
            <div className={styles.inputbox}>
              <label>Full Name</label>
              <input
                type="text"
                value={user?.full_name}
                onChange={(e) =>
                  setUser({ ...user, full_name: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>Tagline</label>
              <input
                type="text"
                value={user?.tagline}
                onChange={(e) => setUser({ ...user, tagline: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Display Name</label>
              <input
                type="text"
                value={user?.display}
                onChange={(e) => setUser({ ...user, display: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Profile Url</label>
              <input
                type="text"
                value={user?.profile_url}
                onChange={(e) =>
                  setUser({ ...user, profile_url: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>Email</label>
              <input
                type="text"
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Public Email</label>
              <input
                type="text"
                value={user?.public_email}
                onChange={(e) =>
                  setUser({ ...user, public_email: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>Phone</label>
              <div>
                <input
                  className={styles.prefix}
                  type="text"
                  value={user?.phone.prefix}
                  onChange={(e) => setUser({ ...user, prefix: e.target.value })}
                />
                <input
                  type="text"
                  value={user?.phone.number}
                  onChange={(e) => setUser({ ...user, number: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.inputbox}>
              <label>Whatsapp</label>
              <div>
                <input
                  className={styles.prefix}
                  type="text"
                  value={user?.whatsapp_number.prefix}
                  onChange={(e) => setUser({ ...user, prefix: e.target.value })}
                />
                <input
                  type="text"
                  value={user?.whatsapp_number.number}
                  onChange={(e) => setUser({ ...user, number: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.inputbox}>
              <label>Year of Birth</label>
              <input
                type="text"
                value={user?.year_of_birth}
                onChange={(e) =>
                  setUser({ ...user, year_of_birth: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>About</label>
              <textarea
                value={user?.about}
                onChange={(e) => setUser({ ...user, about: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Website</label>
              <input
                type="text"
                value={user?.website}
                onChange={(e) => setUser({ ...user, website: e.target.value })}
              />
            </div>

            <div>
              <h2>Primary Address</h2>
              <div className={styles.longInputContainer}>
                <label>Street</label>
                <input
                  type="text"
                  value={user?.primary_address?.street}
                  onChange={(e) => setUser({ ...user, Street: e.target.value })}
                />
              </div>
              <section className={styles.twoColumnGrid}>
                <div className={styles.Addressinputbox}>
                  <label>Society</label>
                  <input
                    type="text"
                    value={user?.primary_address?.society}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Locality</label>
                  <input
                    type="text"
                    value={user?.primary_address?.locality}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
              </section>
              <section className={styles.twoColumnGrid}>
                <div className={styles.Addressinputbox}>
                  <label>City</label>
                  <input
                    type="text"
                    value={user?.primary_address?.city}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Pin code</label>
                  <input
                    type="text"
                    value={user?.primary_address?.pin_code}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
              </section>
              <section className={styles.twoColumnGrid}>
                <div className={styles.Addressinputbox}>
                  <label>State</label>
                  <input
                    type="text"
                    value={user?.primary_address?.state}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
                <div className={styles.Addressinputbox}>
                  <label>Country</label>
                  <input
                    type="text"
                    value={user?.primary_address?.country}
                    onChange={(e) =>
                      setUser({ ...user, website: e.target.value })
                    }
                  />
                </div>
              </section>
            </div>
            <div className={styles.inputbox}>
              <label>Is Onboarded:</label>
              <select
                value={user.is_onboarded.toString()} // Convert boolean to string explicitly
                onChange={(e) => {
                  setUser({ ...user, is_onboarded: e.target.value === 'true' })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
              <div>{`Completed modals: ${user?.completed_onboarding_steps}`}</div>
            </div>
            <div className={styles.inputbox}>
              <label>Is Account activated:</label>
              <select
                value={user.is_account_activated.toString()} // Convert boolean to string explicitly
                onChange={(e) => {
                  setUser({
                    ...user,
                    is_account_activated: e.target.value === 'true',
                  })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
            </div>
            <div className={styles.inputbox}>
              <label>Is Account verified:</label>
              <select
                value={user.verified.toString()} // Convert boolean to string explicitly
                onChange={(e) => {
                  setUser({
                    ...user,
                    verified: e.target.value === 'true',
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

export default EditUserPage
