import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllBlogs = async (query: string): Promise<ApiReturnObject> => {
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

export const searchBlogs = async (searchCriteria: any) => {
  try {
    const queryParams = new URLSearchParams()
    for (const key in searchCriteria) {
      queryParams.append(key, searchCriteria[key])
    }
    const response = await axiosInstance.get(
      `/blogs/blog-search?${queryParams}`,
    )
    return { res: response.data, err: null }
  } catch (error) {
    console.error('Error searching for pages:', error)
    return { res: null, err: error }
  }
}

export const upvoteBlog = async (blogId: string, userId: string) => {
  try {
    const body = { userId }

    const token = localStorage.getItem(`token`)
    const headers = { Authorization: `Bearer ${token}` }

    const res = await axiosInstance.patch(`/blogs/upvote/${blogId}`, body, {
      headers,
    })

    return { res, err: null }
  } catch (err) {
    console.log(`Error in upvoteBlog(): `, err)
    return { res: null, err }
  }
}

export const downvoteBlog = async (blogId: string, userId: string) => {
  try {
    const body = { userId }

    const token = localStorage.getItem(`token`)
    const headers = { Authorization: `Bearer ${token}` }

    const res = await axiosInstance.patch(`/blogs/downvote/${blogId}`, body, {
      headers,
    })

    return { res, err: null }
  } catch (err) {
    console.log(`Error in upvoteBlog(): `, err)
    return { res: null, err }
  }
}
