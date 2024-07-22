import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllBlogs = async (
    query: string,
  ): Promise<ApiReturnObject> => {
    try {
      const res = await axiosInstance.get(`/blogs/?${query}`)
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }

/** Get Blog Comments `GET: /api/blog/comment/` */
export const getBlogComment = async (
  query: String,
): Promise<ApiReturnObject> => {

  try {
    const res = await axiosInstance.get(`/blogs/comment/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Add Comment in Blog `POST: /api/blogs/comment/` */
export const addBlogComment = async (data: {
  blogId: string
  commentBy: string | 'User' | 'Listing'
  commentById: string
  content: string
  date: number
}): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/blogs/comment/`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}