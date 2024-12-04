// pages/admin/users/[profile_url].tsx

import { FormEvent, useEffect, useState } from 'react'
import { getAllUserDetail } from '@/services/user.service'
import styles from './UserEditModal.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { updateUserByAdmin } from '@/services/admin.service'
import { getAllHobbies } from '@/services/hobby.service'
import CloseIcon from '@/assets/icons/CloseIcon'

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}
interface UserEditProps {
  id: string
  setIsEditModalOpen: any
}
const EditUser: React.FC<UserEditProps> = ({ id, setIsEditModalOpen }) => {
  const profile_url = id
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
        `profile_url=${profile_url}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings,sessions`,
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

    console.log(user)

    // const { err, res } = await updateUserByAdmin(user._id, user)
    // if (err) {
    //   setSnackbar({
    //     type: 'warning',
    //     display: true,
    //     message: 'Some error occured',
    //   })
    // } else if (res) {
    //   setSnackbar({
    //     type: 'success',
    //     display: true,
    //     message: 'User updated successfully',
    //   })
    //   setIsEditModalOpen(false)
    // } else {
    //   setSnackbar({
    //     type: 'warning',
    //     display: true,
    //     message: 'Some error occured',
    //   })
    // }
  }

  if (!profile_url || !user) {
    return <div>Loading...</div>
  }

  return (
    <section className={styles.mainContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit User: {user?.full_name}</h1>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() => setIsEditModalOpen(false)}
        />
      </div>

      <div className={styles.mainWrapper}>
        <form onSubmit={updateUserFunc}>
          <div className={styles.twoColumnGrid}>
            {/* full name */}

            <div className={styles.inputbox}>
              <label>Full Name</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.full_name}
                onChange={(e) =>
                  setUser({ ...user, full_name: e.target.value })
                }
              />
            </div>

            {/* email */}

            <div className={styles.inputbox}>
              <label>Email</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.twoColumnGrid}>
            {/* display name */}

            <div className={styles.inputbox}>
              <label>Display Name</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.display}
                onChange={(e) => setUser({ ...user, display: e.target.value })}
              />
            </div>
            {/* profile url */}
            <div className={styles.inputbox}>
              <label>Profile Url</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.profile_url}
                onChange={(e) =>
                  setUser({ ...user, profile_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* birthday */}

            <div className={styles.inputbox}>
              <label>Year of Birth</label>
              <input
                type="date"
                autoComplete="new"
                value={user?.year_of_birth}
                onChange={(e) =>
                  setUser({ ...user, year_of_birth: e.target.value })
                }
              />
            </div>

            {/* public email */}
            <div className={styles.inputbox}>
              <label>Public Email</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.public_email}
                onChange={(e) =>
                  setUser({ ...user, public_email: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* phone */}
            <div className={styles.inputPhoneBox}>
              <label>Phone</label>
              <div className={styles.phoneWrapper}>
                <select
                  name=""
                  id=""
                  className={styles.prefix}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: { ...user.phone, prefix: e.target.value },
                    })
                  }
                >
                  {user?.phone.prefix && (
                    <option value={user?.phone.prefix}>
                      {user?.phone.prefix}
                    </option>
                  )}
                  <option value="+91">+91</option>
                  <option value="+88">+88</option>
                  <option value="+89">+89</option>
                </select>

                <input
                  className={styles.phoneInput}
                  type="text"
                  // maxLength={10}
                  // minLength={10}
                  autoComplete="new"
                  value={user?.phone.number}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      phone: { ...user.phone, number: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            {/* whatsapp */}
            <div className={styles.inputPhoneBox}>
              <label>Whatsapp</label>
              <div className={styles.phoneWrapper}>
                <select
                  className={styles.prefix}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      whatsapp_number: {
                        ...user.whatsapp_number,
                        prefix: e.target.value,
                      },
                    })
                  }
                >
                  {user?.whatsapp_number.prefix && (
                    <option value={user?.whatsapp_number.prefix} disabled>
                      {user?.whatsapp_number.prefix}
                    </option>
                  )}
                  <option value="+91">+91</option>
                  <option value="+88">+88</option>
                  <option value="+89">+89</option>
                </select>
                <input
                  type="text"
                  className={styles.phoneInput}
                  // minLength={10}
                  // maxLength={10}

                  autoComplete="new"
                  value={user?.whatsapp_number.number}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      whatsapp_number: {
                        ...user?.whatsapp_number,
                        number: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* tag line */}
          <div className={styles.inputbox}>
            <label>Tagline</label>
            <input
              type="text"
              autoComplete="new"
              value={user?.tagline}
              onChange={(e) => setUser({ ...user, tagline: e.target.value })}
            />
          </div>

          {/* about */}
          <div className={styles.inputbox}>
            <label>About</label>
            <textarea
              value={user?.about}
              onChange={(e) => setUser({ ...user, about: e.target.value })}
            />
          </div>
          {/* website */}
          <div className={styles.inputbox}>
            <label>Website</label>
            <input
              type="text"
              autoComplete="new"
              value={user?.website}
              onChange={(e) => setUser({ ...user, website: e.target.value })}
            />
          </div>
          {/* address */}
          <div>
            <h2 className={styles.h2}>Primary Address</h2>
            <div className={styles.longInputContainer}>
              <label>Street</label>
              <input
                type="text"
                autoComplete="new"
                value={user?.primary_address?.street}
                onChange={(e) =>
                  setUser({
                    ...user,
                    primary_address: {
                      ...user?.primary_address,
                      street: e.target.value,
                    },
                  })
                }
              />
            </div>
            <section className={styles.twoColumnGrid}>
              <div className={styles.Addressinputbox}>
                <label>Society</label>
                <input
                  type="text"
                  autoComplete="new"
                  value={user?.primary_address?.society}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
                        society: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Locality</label>
                <input
                  type="text"
                  autoComplete="new"
                  value={user?.primary_address?.locality}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
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
                  autoComplete="new"
                  value={user?.primary_address?.city}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
                        city: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Pin code</label>
                <input
                  type="text"
                  autoComplete="new"
                  value={user?.primary_address?.pin_code}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
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
                  autoComplete="new"
                  value={user?.primary_address?.state}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
                        state: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className={styles.Addressinputbox}>
                <label>Country</label>
                <input
                  type="text"
                  autoComplete="new"
                  value={user?.primary_address?.country}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
                        country: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </section>
          </div>
          {/* onboard */}
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
            <div
              className={styles.completeAction}
            >{`Completed modals: ${user?.completed_onboarding_steps}`}</div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* accountActive */}
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
            {/* accountVerified */}
            <div className={styles.inputbox}>
              <label>Is Account verified:</label>
              <select
                value={user.verified.toString()}
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
          </div>

          <div className={styles.lastLogin}>
            {' '}
            <h3>Last Login</h3>
            <span>{` ${user._sessions[0]?.device}`}</span>
          </div>
          <div className={styles.btnWrapper}>
            <button className={styles.saveButton} type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
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
    </section>
  )
}

export default EditUser
