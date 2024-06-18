// pages/admin/users/[slug].tsx

import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { getAllUserDetail } from '@/services/user.service'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import {
  getAdminHobbies,
  updateHobbyByAdmin,
  updateUserByAdmin,
} from '@/services/admin.service'
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
  const [searchKey, setSearchKey] = useState('')
  const [tag, setTag] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      const { err, res } = await getAdminHobbies(
        `slug=${slug}&populate=category,sub_category,tags`, // Ensure tags are populated
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

  const handleAddSearchKey = () => {
    if (searchKey.trim()) {
      setUser((prevUser: any) => ({
        ...prevUser,
        search_key: [...prevUser.search_key, searchKey],
      }))
      setSearchKey('')
    }
  }

  const handleDeleteSearchKey = (keyToDelete: string) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      search_key: prevUser.search_key.filter(
        (key: string) => key !== keyToDelete,
      ),
    }))
  }

  const handleAddTag = () => {
    if (tag.trim()) {
      setUser((prevUser: any) => ({
        ...prevUser,
        tags: [...prevUser.tags, { _id: tag }],
      }))
      setTag('')
    }
  }

  const handleDeleteTag = (tagId: string) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      tags: prevUser.tags.filter((t: any) => t._id !== tagId),
    }))
  }

  const handleSubmit = async () => {
    const { err, res } = await updateHobbyByAdmin(user._id, user)
    if (err) {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occurred',
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
        message: 'Some error occurred',
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
          <h1>Edit Hobby: {user?.display}</h1>
          <div>
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
                value={user?.category?.display || user?.category}
                onChange={(e) => setUser({ ...user, category: e.target.value })}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Sub Category</label>
              <input
                type="text"
                value={user?.sub_category?.display || user?.sub_category}
                onChange={(e) =>
                  setUser({ ...user, sub_category: e.target.value })
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
              <label>Description</label>
              <textarea
                value={user?.description}
                onChange={(e) =>
                  setUser({ ...user, description: e.target.value })
                }
              />
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
            <div className={styles.inputbox}>
              <label>Search Keys</label>
              <ul>
                {user.search_key.map((key: string) => (
                  <li key={key}>
                    {key}{' '}
                    <button onClick={() => handleDeleteSearchKey(key)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <button className={styles.addbtn} onClick={handleAddSearchKey}>
                Add Search Key
              </button>
            </div>
            <div className={styles.inputbox}>
              <label>Tags id</label>
              <ul>
                {user.tags.map((tag: any) => (
                  <li key={tag._id || tag}>
                    {tag._id || tag._id || tag}{' '}
                    <button onClick={() => handleDeleteTag(tag._id || tag)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
              <button className={styles.addbtn} onClick={handleAddTag}>
                Add Tag
              </button>
            </div>
            <button onClick={handleSubmit}>Save Changes</button>
          </div>
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
