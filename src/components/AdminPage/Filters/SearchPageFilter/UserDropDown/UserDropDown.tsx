import React, { useState, useRef, useEffect } from 'react'

import styles from './UserDropDown.module.css' // Import your custom button component

import { searchUsersAdvanced } from '@/services/user.service'
import Image from 'next/image'
import { useSearchPageContext } from '@/pages/admin/searches'

interface InviteSectionProps {}

const UserDropdown: React.FC<InviteSectionProps> = ({}) => {
  const { setFilterState } = useSearchPageContext()

  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const inviteBtnRef = useRef<HTMLButtonElement>(null)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filtersUsersLoading, setFilteredUsersLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>()
  const [showModal, setShowModal] = useState(false)

  const fetchUsers = async (query: string) => {
    setFilteredUsersLoading(true)
    try {
      let searchCriteria = {
        name: query,
      }
      const { res, err } = await searchUsersAdvanced(searchCriteria)
      console.log('Data : ', res.data)

      setFilteredUsers(res.data)
      setFilteredUsersLoading(false)
    } catch (error) {
      setFilteredUsersLoading(false)
      console.error('Error fetching users:', error)
    }
  }
  const handleUserSelect = (selectedUser: any) => {
    setEmail(selectedUser.full_name)
    setSelectedUser(selectedUser)
    setFilterState((pre) => {
      return { ...pre, user: selectedUser }
    })
    setShowModal(false)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setEmail(input)

    if (input.startsWith('@') && input.length > 1) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }
  // Effect to call API when email starts with @ and modal is open
  useEffect(() => {
    if (showModal) {
      const query = email.slice(1) // Remove "@" from query
      console.log(query)
      fetchUsers(query || '') // Fetch all users if query is empty
    }
  }, [email, showModal])

  return (
    <section className={`${styles['invite-wrapper']}`}>
      <header>
        <h3 className={styles.header}>User</h3>
      </header>
      <section className={styles['wrapper']}>
        <input
          autoComplete="new"
          value={email}
          placeholder="Email or @ mention"
          name="society"
          onChange={handleInputChange}
          type="email"
          className={error ? styles['error-input'] : ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              inviteBtnRef?.current?.click()
            }
          }}
        />

        {showModal && (
          <div className={styles['modal-container']}>
            <ul className={styles['modal-list']}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <li
                    key={user.id}
                    className={styles['modal-item']}
                    onClick={() => handleUserSelect(user)}
                  >
                    <Image
                      src={user.profile_image || '/defaultUserIcon.png'} // Adjust the fallback path
                      alt={user.full_name}
                      className={styles['profile-pic']}
                      height={20}
                      width={20}
                    />
                    <div>
                      <p className={styles['user-name']}>
                        {user.full_name.length > 23
                          ? user.full_name.slice(0, 23) + '...'
                          : user.full_name}
                      </p>
                      <p className={styles['user-tagline']}>
                        {user.tagline ? user.tagline.slice(0, 25) + '...' : ''}
                      </p>
                    </div>
                  </li>
                ))
              ) : !filtersUsersLoading ? (
                <li className={styles['modal-item']}>No users found</li>
              ) : (
                <li className={styles['modal-item']}>Loading...</li>
              )}
            </ul>
          </div>
        )}
      </section>
    </section>
  )
}

export default UserDropdown
