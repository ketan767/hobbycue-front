import { FormEvent, useEffect, useState } from 'react'
import { getAllUserDetail } from '@/services/user.service'
import styles from './UserEditModal.module.css'

import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import { updateUserByAdmin } from '@/services/admin.service'

import CloseIcon from '@/assets/icons/CloseIcon'
import Link from 'next/link'

interface UserEditProps {
  id: string
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  fetchUsers: () => void
}
const EditUser: React.FC<UserEditProps> = ({
  id,
  setIsEditModalOpen,
  fetchUsers,
}) => {
  const profile_url = id
  const [user, setUser] = useState<any>(null)
  const [errors, setErrors] = useState<any>({})
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const fetchUserData = async () => {
    const { err, res } = await getAllUserDetail(
      `profile_url=${profile_url}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings,sessions`,
    )
    setUser(res?.data.data?.users[0])
    console.log(res?.data.data?.users)
  }
  useEffect(() => {
    fetchUserData()
  }, [profile_url])

  const updateUserFunc = async (e: FormEvent) => {
    e.preventDefault()

    console.log(user)

    const { err, res } = await updateUserByAdmin(user._id, user)
    if (err) {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    } else if (res) {
      console.log(res)
      fetchUserData()
      fetchUsers()
      setSnackbar({
        type: 'success',
        display: true,
        message: 'User updated successfully',
      })
      setIsEditModalOpen(false)
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
    <section className={styles.mainContainer}>
      <div className={styles.header}>
        <h1
          className={styles.title}
          title={user?.full_name && user.full_name.length > 30 ? user.full_name : ''}
        >
          Edit User:{' '}
          {user?.full_name && user.full_name.length > 30
            ? `${user.full_name.slice(0, 30)} ...`
            : user?.full_name}
        </h1>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={() => setIsEditModalOpen(false)}
        />
      </div>
        <hr style={{marginBottom:"8px"}} />
      <div className={styles.mainWrapper}>
        <form onSubmit={updateUserFunc}>
          <div className={styles.twoColumnGrid}>
            {/* full name */}

            <div className={styles.inputbox}>
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                autoComplete="new"
                value={user?.full_name}
                onChange={(e) => {
                  const value = e.target.value
                  setUser({ ...user, full_name: value })

                  if (!value.trim()) {
                    setErrors({
                      ...errors,
                      full_name: 'Full Name is required.',
                    })
                  } else if (value.length < 2) {
                    setErrors({
                      ...errors,
                      full_name:
                        'Full Name must be at least 2 characters long.',
                    })
                  } else if (value.length > 50) {
                    setErrors({
                      ...errors,
                      full_name: 'Full Name must not exceed 50 characters.',
                    })
                  } else {
                    const { full_name, ...rest } = errors // Remove the error if valid
                    setErrors(rest)
                  }
                }}
              />
              {errors.full_name && (
                <p className={styles.error}>{errors.full_name}</p>
              )}
            </div>

            {/* email */}

            <div className={styles.inputbox}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                autoComplete="new"
                value={user?.email}
                onChange={(e) => {
                  const value = e.target.value
                  setUser({ ...user, email: value })

                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                  if (value && !emailRegex.test(value)) {
                    setErrors({ ...errors, email: 'Invalid email format.' })
                  } else {
                    const { email, ...rest } = errors // Remove the email error if valid
                    setErrors(rest)
                  }
                }}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>
          </div>
          <div className={styles.twoColumnGrid}>
            {/* display name */}
            <div className={styles.inputbox}>
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                autoComplete="new"
                value={user?.display_name}
                onChange={(e) => {
                  const value = e.target.value
                  setUser({ ...user, display_name: value })

                  if (value && value.length < 3) {
                    setErrors({
                      ...errors,
                      display:
                        'Display Name must be at least 3 characters long.',
                    })
                  } else if (value && value.length > 30) {
                    setErrors({
                      ...errors,
                      display: 'Display Name must not exceed 30 characters.',
                    })
                  } else {
                    const { display, ...rest } = errors // Remove the error if valid
                    setErrors(rest)
                  }
                }}
              />
              {errors.display && (
                <p className={styles.error}>{errors.display}</p>
              )}
            </div>

            {/* profile url */}
            <div className={styles.inputbox}>
              <label htmlFor="profileUrl">Profile URL</label>
              <input
                id="profileUrl"
                type="text"
                autoComplete="new"
                value={user?.profile_url}
                onChange={(e) => {
                  const value = e.target.value
                  setUser({ ...user, profile_url: value })

                  // Regular Expression for Basic URL Validation
                  const urlRegex =
                    /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([^\s]*)?$/

                  if (value && !urlRegex.test(value)) {
                    setErrors({ ...errors, profile_url: 'Invalid URL format.' })
                  } else {
                    const { profile_url, ...rest } = errors // Remove the error if valid
                    setErrors(rest)
                  }
                }}
              />
              {errors.profile_url && (
                <p className={styles.error}>{errors.profile_url}</p>
              )}
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* birthday */}

            <div className={styles.inputbox}>
              <label>Year of Birth</label>
              <input
                type="date"
                autoComplete="new"
                style={{cursor: 'pointer'}}
                value={user?.year_of_birth}
                onChange={(e) =>
                  setUser({ ...user, year_of_birth: e.target.value })
                }
              />
            </div>

            {/* public email */}
            <div className={styles.inputbox}>
              <label htmlFor="publicEmail">Public Email</label>
              <input
                id="publicEmail"
                type="text"
                autoComplete="new"
                value={user?.public_email}
                onChange={(e) => {
                  const value = e.target.value
                  setUser({ ...user, public_email: value })

                  // Regular Expression for Email Validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                  if (value && !emailRegex.test(value)) {
                    setErrors({
                      ...errors,
                      public_email: 'Invalid email format.',
                    })
                  } else {
                    const { public_email, ...rest } = errors // Remove the error if valid
                    setErrors(rest)
                  }
                }}
              />
              {errors.public_email && (
                <p className={styles.error}>{errors.public_email}</p>
              )}
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* phone */}
            <div className={styles.inputPhoneBox}>
              <label htmlFor="phone">Phone</label>
              <div className={styles.phoneWrapper}>
                <select
                  name="phonePrefix"
                  id="phonePrefix"
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
                  id="phoneNumber"
                  type="text"
                  maxLength={10}
                  autoComplete="new"
                  value={user?.phone.number}
                  onChange={(e) => {
                    const value = e.target.value
                    setUser({
                      ...user,
                      phone: { ...user.phone, number: value },
                    })

                    const phoneRegex = /^[0-9]{10}$/

                    if (value && !phoneRegex.test(value)) {
                      setErrors({
                        ...errors,
                        phone: 'Phone number must be exactly 10 digits.',
                      })
                    } else {
                      const { phone, ...rest } = errors // Remove the error if valid
                      setErrors(rest)
                    }
                  }}
                />
              </div>
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
            </div>

            {/* whatsapp */}
            <div className={styles.inputPhoneBox}>
              <label htmlFor="whatsappNumber">WhatsApp</label>
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
                  minLength={10}
                  maxLength={10}
                  autoComplete="new"
                  value={user?.whatsapp_number.number}
                  onChange={(e) => {
                    const value = e.target.value
                    setUser({
                      ...user,
                      whatsapp_number: {
                        ...user?.whatsapp_number,
                        number: value,
                      },
                    })

                    const phoneRegex = /^[0-9]{10}$/

                    if (value && !phoneRegex.test(value)) {
                      setErrors({
                        ...errors,
                        whatsapp_number:
                          'WhatsApp number must be exactly 10 digits.',
                      })
                    } else {
                      const { whatsapp_number, ...rest } = errors // Remove the error if valid
                      setErrors(rest)
                    }
                  }}
                />
              </div>
              {errors.whatsapp_number && (
                <p className={styles.error}>{errors.whatsapp_number}</p>
              )}
            </div>
          </div>

          {/* tag line */}
          <div className={styles.inputbox}>
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              type="text"
              autoComplete="new"
              value={user?.tagline}
              onChange={(e) => {
                const value = e.target.value
                setUser({ ...user, tagline: value })

                // Basic length validation for tagline (optional)
                if (value && value.length > 100) {
                  setErrors({
                    ...errors,
                    tagline: 'Tagline cannot be longer than 100 characters.',
                  })
                } else {
                  const { tagline, ...rest } = errors // Remove the error if valid
                  setErrors(rest)
                }
              }}
            />
            {errors.tagline && <p className={styles.error}>{errors.tagline}</p>}
          </div>

          {/* about */}
          <div className={styles.inputbox}>
            <label htmlFor="about">About</label>
            <textarea
              id="about"
              value={user?.about}
              onChange={(e) => {
                const value = e.target.value
                setUser({ ...user, about: value })

                // Optional: Ensure a minimum length, if required
                if (value && value.length < 20) {
                  setErrors({
                    ...errors,
                    about: 'About text must be at least 20 characters.',
                  })
                } else if (value && value.length > 300) {
                  setErrors({
                    ...errors,
                    about: 'About text cannot be longer than 300 characters.',
                  })
                } else {
                  const { about, ...rest } = errors // Remove the error if valid
                  setErrors(rest)
                }
              }}
            />
            {errors.about && <p className={styles.error}>{errors.about}</p>}
          </div>

          {/* website */}
          <div className={styles.inputbox}>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              autoComplete="new"
              value={user?.website}
              onChange={(e) => {
                const value = e.target.value
                setUser({ ...user, website: value })

                // URL validation
                const urlPattern =
                  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
                if (value && !urlPattern.test(value)) {
                  setErrors({
                    ...errors,
                    website: 'Please enter a valid website URL.',
                  })
                } else {
                  const { website, ...rest } = errors // Remove the error if valid
                  setErrors(rest)
                }
              }}
            />
            {errors.website && <p className={styles.error}>{errors.website}</p>}
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
                  onChange={(e) => {
                    const value = e.target.value
                    setUser({
                      ...user,
                      primary_address: {
                        ...user?.primary_address,
                        pin_code: value,
                      },
                    })

                    // Validate pin code (e.g., for 6-digit format)
                    const pinCodePattern = /^\d{6}$/
                    if (value && !pinCodePattern.test(value)) {
                      setErrors({
                        ...errors,
                        pin_code: 'Please enter a valid 6-digit pin code.',
                      })
                    } else {
                      const { pin_code, ...rest } = errors
                      setErrors(rest)
                    }
                  }}
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

            {/* Show error messages for address validation */}
            {errors.pin_code && (
              <p className={styles.error}>{errors.pin_code}</p>
            )}
          </div>

          {/* onboard */}
          <div className={styles.inputbox}>
            <label>Is Onboarded:</label>
            <select
            style={{cursor: 'pointer'}}
              value={user.is_onboarded.toString()} // Convert boolean to string explicitly
              onChange={(e) => {
                setUser({ ...user, is_onboarded: e.target.value === 'true' })
              }}
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>

            {/* Error message if not selected */}
            {user.is_onboarded === null && (
              <p className={styles.error}>
                Please select whether the user is onboarded.
              </p>
            )}

            <div className={styles.completeAction}>
              {`Completed modals: ${user?.completed_onboarding_steps}`}
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            {/* accountActive */}
            <div className={styles.inputbox}>
              <label>Is Account Activated:</label>
              <select
              style={{cursor: 'pointer'}}
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

              {/* Validation message */}
              {user.is_account_activated === null && (
                <p className={styles.error}>
                  Please select if the account is activated.
                </p>
              )}
            </div>

            {/* accountVerified */}
            <div className={styles.inputbox}>
              <label>Is Account Verified:</label>
              <select
              style={{cursor: 'pointer'}}
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

              {/* Validation message */}
              {user.verified === null && (
                <p className={styles.error}>
                  Please select if the account is verified.
                </p>
              )}
            </div>
          </div>

          <div className={styles.lastLogin}>
            {' '}
            <h3>Last Login</h3>
            <span>{` ${user._sessions[0]?.device}`}</span>
          </div>
            <div className={styles.auditFields}>
              <div className={styles.auditField}>
                <span className={styles.label}>Created By:</span>
                    <Link
                    href={`/profile/${user.profile_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <span className={styles.value}>{user.full_name || "N/A"}</span>
                    </Link>
              </div>
              <div className={styles.auditField}>
                <span className={styles.label}>Created At:</span>
                <span className={styles.value}>
                {user.createdAt ? 
                  (() => {
                      const date = new Date(user.createdAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
              </div>
              <div className={styles.auditField}>
                <span className={styles.label}>Updated By:</span>
                <Link
                    href={user.updated_profile_url ? `/profile/${user.updated_profile_url}` : `/profile/admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <span className={styles.value}>{user.updatedBy || "HobbyCue Admin"}</span>
                    </Link>
                {/* <span className={styles.value}></span> */}
              </div>
              <div className={styles.auditField}>
                <span className={styles.label}>Updated At:</span>
                <span className={styles.value}>
                {user.updatedAt ? 
                  (() => {
                      const date = new Date(user.updatedAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
              </div>
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
