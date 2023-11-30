import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { searchUsers } from './../../../services/user.service'
import styles from './styles.module.css'
import Image from 'next/image'
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
        {searchResults.map((user, index) => (
          <div className={styles.resultItem} key={index}>
            <div className={styles.avatarContainer}>
              {user.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt={`${user.full_name}'s `}
                  width={64}
                  height={64}
                  className={styles.avatarImage}
                />
              ) : (
                <div
                  className={`${styles['img']} default-people-listing-icon`}
                ></div>
              )}
            </div>
            <div className={styles.detailsContainer}>
              <div className={styles.userName}>{user?.full_name}</div>
            </div>
            <div className={styles.middlebutton}>
              {user.facebook.id ? 'Facebook' : user.google.id ? 'Google' : ''}
            </div>
            <button
              type="submit"
              className={styles.searchButton}
              onClick={() => {
                setEmail(user.email)
                resetbtn()
              }}
            >
              Reset password
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
