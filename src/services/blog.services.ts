import { useQuery } from 'react-query'
import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllBlogs = async (query: string): Promise<ApiReturnObject> => {
  try {
    let url = `/blogs/?${query}`
    console.log(url)
    const res = await axiosInstance.get(url)
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
      `/blogs/blog-search-advanced?${queryParams}`,
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

export const createBlog = async () => {
  try {
    const token = localStorage.getItem(`token`)
    const body = null
    const headers = { Authorization: `Bearer ${token}` }
    const res = await axiosInstance.post(`/blogs/create`, body, { headers })
    return { res, err: null }
  } catch (err) {
    return { res: null, err }
  }
}

interface UpdateBlogArgsType {
  title?: string
  tagline?: string
  content?: string
  blogId: string
}

export const updateBlog = async ({
  title,
  tagline,
  content,
  blogId,
  ...args
}: UpdateBlogArgsType) => {
  try {
    const body = { title, tagline, content }
    const token = localStorage.getItem(`token`)
    const headers = { Authorization: `Bearer ${token}` }
    const res = await axiosInstance.patch(`/blogs/edit/${blogId}`, body, {
      headers,
    })
    return { res, err: null }
  } catch (err) {
    return { res: null, err }
  }
}

export const uploadBlogImage = async (formData: FormData, blogId: string) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/blogs/upload-blog-image/${blogId}`,
      formData,
      {
        headers,
      },
    )
    return { res, err: null }
  } catch (err) {
    return { err: err, res: null }
  }
}

export const useGetBlogById = (query: string) => {
  return useQuery({
    queryKey: ['blogs', query],
    queryFn: async () => {
      let url = `/blogs/?${query}`
      const { data } = await axiosInstance.get(url)

      return data
    },
  })
}

// Example: const axiosInstance = axios.create({ baseURL: 'http://localhost:5000/api' });

export async function addHobby(blogId: string, hobbyData: any) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!token) {
    throw new Error('Token not found. Please log in.')
  }

  try {
    const response = await axiosInstance.post(
      `/blogs/${blogId}/hobbies`,
      hobbyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data // Parsed JSON response
  } catch (error) {
    console.error('Error adding hobby:', error)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Failed to add hobby')
    } else {
      throw error
    }
  }
}
