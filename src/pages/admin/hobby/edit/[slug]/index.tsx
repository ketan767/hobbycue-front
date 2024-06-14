// pages/admin/users/[slug].tsx

import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { getAllUserDetail } from '@/services/user.service'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { getAdminHobbies, updateUserByAdmin } from '@/services/admin.service'
import { getAllHobbies } from '@/services/hobby.service'

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

const EditUserPage: React.FC = () => {
  const router = useRouter()
  const { slug } = router.query
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
      const { err, res } = await getAdminHobbies(
        `slug=${slug}&populate=category,sub_category`,
      )
      setUser(res?.data.data?.hobbies[0])
      console.log(res?.data.data?.hobbies)
    }

    if (slug) {
      fetchUserData()
      getAllHobbies(
        `fields=display,genre&level=3&level=2&level=1&level=0&show=true`,
      )
        .then((res) => {
          setHobbies(res.res.data.hobbies)
        })
        .catch((err) => console.log({ err }))
    }
  }, [slug])

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

  if (!slug || !user) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AdminLayout>
        <div className={styles.mainWrapper}>
          <h1>Edit Hobby: {user?.full_name}</h1>
          <form onSubmit={updateUserFunc}>
            <div className={styles.inputbox}>
              <label>Display</label>
              <input
                type="text"
                value={user?.display}
                onChange={(e) => setUser({ ...user, display: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Category</label>
              <input
                type="text"
                value={user?.category.display}
                onChange={(e) => setUser({ ...user, category: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Sub Category</label>
              <input
                type="text"
                value={user?.sub_categoy}
                onChange={(e) =>
                  setUser({ ...user, sub_categoy: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>Hobby url</label>
              <input
                type="text"
                value={user?.slug}
                onChange={(e) => setUser({ ...user, slug: e.target.value })}
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
                value={user?.description}
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
              <label>Allow Add:</label>
              <select
                value={user.show.toString()} // Convert boolean to string explicitly
                onChange={(e) => {
                  setUser({ ...user, show: e.target.value === 'true' })
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
