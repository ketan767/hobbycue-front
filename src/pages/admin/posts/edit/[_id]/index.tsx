// pages/admin/users/[_id].tsx

import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import styles from './styles.module.css'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import { getAllPosts } from '@/services/post.service'
import dynamic from 'next/dynamic'
import { getAllHobbies } from '@/services/hobby.service'
import { updatePostByAdmin } from '@/services/admin.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'

const CustomEditor = dynamic(() => import('@/components/CustomEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

const EditUserPage: React.FC = () => {
  const router = useRouter()
  const { _id } = router.query
  const [post, setPost] = useState<any>(null)
  const [hobbies, setHobbies] = useState<DropdownListItem[]>([])
  const [genres, setGenres] = useState<DropdownListItem[]>([])
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  console.log({ genres })
  console.log({ post })
  useEffect(() => {
    const fetchPostData = async () => {
      const { err, res } = await getAllPosts(
        `_id=${_id}&populate=_author,_genre,_hobby,_allHobbies._hobby1,_allHobbies._hobby2,_allHobbies._hobby3,_allHobbies._genre1,_allHobbies._genre2,_allHobbies._genre3`,
      )
      setPost(res?.data.data?.posts[0])
    }

    if (_id) {
      fetchPostData()
      getAllHobbies(
        `fields=display,genre&level=3&level=2&level=1&level=0&show=true`,
      )
        .then((res) => {
          setHobbies(res.res.data.hobbies)
        })
        .catch((err) => console.log({ err }))
    }
  }, [_id])

  const updatePostFunc = async (e: FormEvent) => {
    e.preventDefault()
    const { err, res } = await updatePostByAdmin(post._id, post)
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
        message: 'Post updated successfully',
      })
    } else {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      const chosenHobby = hobbies.find((obj) => obj._id === post?._hobby?._id)
      if (chosenHobby && chosenHobby.genre && chosenHobby.genre.length > 0) {
        const query = `fields=display&show=true&genre=${chosenHobby.genre[0]}&level=5`
        const { err, res } = await getAllHobbies(query)
        console.log({ res })
        if (!err) {
          setGenres(res.data.hobbies)
        }
      }
    }
    fetchGenres()
  }, [hobbies, post])

  if (!_id || !post) {
    return <div>Loading...</div>
  }

  return (
    <>
      <AdminLayout>
        <div className={styles.mainWrapper}>
          <h1>Edit Post: {post?._id}</h1>
          <form onSubmit={updatePostFunc}>
            <div className={styles.inputbox}>
              <label>Content</label>
              <CustomEditor
                value={post?.content}
                onChange={(value: any) => {
                  setPost((prev: any) => {
                    return { ...prev, content: value }
                  })
                }}
                setData={setPost}
                data={post}
                image={true}
              />
            </div>
            <div className={styles.inputbox}>
              <label>Visibility</label>
              <input
                type="text"
                autoComplete="new"
                value={post?.visibility}
                onChange={(e) =>
                  setPost({ ...post, visibility: e.target.value })
                }
              />
            </div>
            <div className={styles.inputbox}>
              <label>Is Published</label>
              <select
                value={post?.is_published} // Convert boolean to string explicitly
                onChange={(e) => {
                  setPost({
                    ...post,
                    is_published: e.target.value === 'true',
                  })
                }}
              >
                <option value={'true'}>Yes</option>
                <option value={'false'}>No</option>
              </select>
            </div>
            <div className={styles.inputbox}>
              <label>Hobby</label>
              <select
                value={post?._hobby?._id}
                onChange={async (e) => {
                  setGenres([])
                  const chosenHobby = hobbies.find(
                    (obj) => obj._id === e.target.value,
                  )
                  setPost({
                    ...post,
                    _hobby: chosenHobby,
                    _genre: {},
                  })
                }}
              >
                {hobbies.map((obj) => (
                  <option key={obj._id} value={obj._id}>
                    {obj.display}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputbox}>
              <label>Genre</label>
              <select
                onChange={(e) => {
                  setPost({
                    ...post,
                    _genre: genres.find((obj) => obj._id === e.target.value),
                  })
                }}
                value={post?._genre?._id}
              >
                {genres.map((obj) => (
                  <option key={obj._id} value={obj._id}>
                    {obj?.display}
                  </option>
                ))}
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
