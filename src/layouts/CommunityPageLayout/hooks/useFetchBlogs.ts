import { updateBlogs, updatePagesLoading } from '@/redux/slices/post'
import { RootState } from '@/redux/store'
import { getAllBlogs } from '@/services/blog.services'
import { useDispatch, useSelector } from 'react-redux'

function filterBlogsByHobbyDisplayNames(
  blogs: any,
  hobbyId: any,
  genreId: any,
) {
  return blogs.filter((blog: any) =>
    blog._hobbies.some((hobby: any) => {
      if (genreId) {
        return hobby.genre?._id === genreId && hobby.hobby._id === hobbyId
      }
      return hobby.hobby._id === hobbyId
    }),
  )
}
export default function useFetchBlogs() {
  const dispatch = useDispatch()
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const fetchBlogs = async (
    selectedHobby: string,
    selectedGenre: string | undefined,
  ) => {
    if (selectedHobby === undefined || !activeProfile?.data?._hobbies) return
    const params = new URLSearchParams(
      `populate=_hobbies,author&status=Published`,
    )

    const { err, res } = await getAllBlogs(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      let filteredBlogs = []
      if (selectedHobby === 'All Hobbies') {
        filteredBlogs = res.data.data.blog
      } else if (selectedHobby === 'My Hobbies') {
        filteredBlogs = res.data.data.blog
      } else {
        filteredBlogs = filterBlogsByHobbyDisplayNames(
          res.data.data.blog,
          selectedHobby,
          selectedGenre,
        )
      }
      console.log('filteredBlogs', filteredBlogs)
      dispatch(updateBlogs(filteredBlogs))
      dispatch(updatePagesLoading(false))
    }
  }
  return fetchBlogs
}
