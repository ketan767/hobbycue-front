import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from './../../../services/user.service'
import styles from './styles.module.css'
import Image from 'next/image'
import DefaultProfile from '@/assets/svg/default-images/default-user-icon.svg'
import { forgotPassword } from '@/services/auth.service'
import {
  closeModal,
  openModal,
  updateForgotPasswordEmail,
} from '@/redux/slices/modal'

type UserProps = {
  profile_image: string
  full_name: string
  tagline: string
  _address: { city: string }
  user_url: string
  facebook: any
  google: any
  email: string
  last_loggedIn_via: string
  is_password: string
}
type SearchInput = {
  search: InputData<string>
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch()
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [email, setEmail] = useState('')
  const [searchResults, setSearchResults] = useState<UserProps[]>([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }

  const handleSearch = async (event: any) => {
    const searchValue = data.search.value.trim()
    event.preventDefault()
    let searchCriteria = {
      full_name: searchValue,
    }

    const { res, err } = await searchUsers(searchCriteria)
    if (err) {
      console.log('An error', err)
    } else {
      setSearchResults(res.data)
      console.log('res', res)
    }
  }
  const resetbtn = async () => {
    const { err, res } = await forgotPassword({
      email,
    })
    dispatch(openModal({ type: 'reset-password', closable: true }))
    dispatch(updateForgotPasswordEmail(email))
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.admintitle}>Admin Search</div>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={data.search.value}
          onChange={handleInputChange}
          placeholder="Search users..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.resultsContainer}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Logged In By</th>
              <th>Login Types</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((user, index) => (
              <tr key={index}>
                <td>
                  <div className={styles.resultItem}>
                    <div className={styles.avatarContainer}>
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={`${user.full_name}'s profile`}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <Image
                          className={styles['img']}
                          src={DefaultProfile}
                          alt="profile"
                          width={40}
                          height={40}
                        />
                      )}
                    </div>
                    <div className={styles.detailsContainer}>
                      <div className={styles.userName}>{user?.full_name}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.lastLoggedIn}>
                  <div className={styles.detailsContainer}>
                    <div className={styles.userName}>
                      {user?.last_loggedIn_via}
                    </div>
                  </div>
                </td>
                <td className={styles.LoginType}>
                  {user.facebook.id && user.google.id && user.is_password
                    ? 'Facebook | Google | Mail'
                    : user.facebook.id && user.google.id
                    ? 'Facebook and Google'
                    : user.facebook.id && user.is_password
                    ? 'Facebook | Mail'
                    : user.google.id && user.is_password
                    ? 'Google | Mail'
                    : user.facebook.id
                    ? 'Facebook'
                    : user.google.id
                    ? 'Google'
                    : user.is_password
                    ? 'Mail'
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
