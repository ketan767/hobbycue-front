import axiosInstance, { operation } from './_axios'

export const getAllPosts = async (query: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/post/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Create a User Post `POST: /api/post/user/` */
export const createUserPost = async (data: {
  hobbyId: string
  genreId: string | undefined
  content: string
  visibility: string,
  media : []
}): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/post/user/`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Create a User Post `POST: /api/post/listing/` */
export const createListingPost = async (data: {
  listingId: string
  hobbyId: string
  genreId: string | undefined
  content: string
  visibility: string
}): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/post/listing/`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** UpVote Post `PATCH: /api/post/upvote/:postId` */
export const upvotePost = async (
  postId: string,
  data: {
    upvoteBy: 'user' | 'listing'
    userId?: string
    listingId?: string
  },
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/post/upvote/${postId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
/** DownVote Post `PATCH: /api/post/upvote/:postId` */
export const downvotePost = async (
  postId: string,
  data: {
    downvoteBy: 'user' | 'listing'
    userId?: string
    listingId?: string
  },
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/post/downvote/${postId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Upload Post Image `POST /api/post/upload-image`
 * - FormData Required Key: `post` */
export const uploadImage = async (formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/upload-image`, formData, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
