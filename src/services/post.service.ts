import { headers } from 'next/headers'
import axiosInstance, { operation } from './_axios'
type stringOrUndefined = string | undefined
export const getAllPosts = async (query: string): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/post/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllHobbyPosts = async (query: string): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/post/hobby-posts?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Gets all User Posts with Comments data `GET: /api/post/with-comments/` */
export const getAllPostsWithComments = async (
  query: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/post/with-comments/?${query}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Create a User Post `POST: /api/post/user/` */
export const createUserPost = async (data: {
  hobbyIds: string[]
  genreIds: stringOrUndefined[]
  content: string
  visibility: string
  media: []
  hasLink: Boolean
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

/** Create a Listing Page Post `POST: /api/post/listing/` */
export const createListingPost = async (data: {
  listingId: string
  hobbyIds: string[]
  genreIds: stringOrUndefined[]
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
    const res = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/upload-image`,
      formData,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getMetadata = async (url: string): Promise<ApiReturnObject> => {
  const body = { url }
  try {
    const res = await axiosInstance.post(`/post/get-metadata`, body, {})
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get Post Comments `GET: /api/post/comment/` */
export const getPostComment = async (
  query: String,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/post/comment/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Add Comment in Post `POST: /api/post/comment/` */
export const addPostComment = async (data: {
  postId: string
  commentBy: string | 'User' | 'Listing'
  commentById: string
  content: string
  date: number
}): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/post/comment/`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** UpVote Post Comment `PATCH: /api/post/comment/upvote/:commentId` */
export const upvotePostComment = async (
  commentId: string,
  data: {
    upvoteBy: 'user' | 'listing'
    upvoteById: string
  },
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/post/comment/upvote/${commentId}`,
      data,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DownVote Post Comment `PATCH: /api/post/comment/downvote/:commentId` */
export const downvotePostComment = async (
  commentId: string,
  data: {
    downvoteBy: 'user' | 'listing'
    downvoteById: string
  },
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/post/comment/downvote/${commentId}`,
      data,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Remove Vote Post Comment `PATCH: /api/post/comment/downvote/:commentId` */
export const removevotePostComment = async (
  commentId: string,
  data: {
    voteBy: 'user' | 'listing'
    userId: string
  },
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/post/comment/remove-vote/${commentId}`,
      data,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const deletePostComment = async (commentId: string) => {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }
  try {
    const res = await axiosInstance.post(`/post/comment/delete/${commentId}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (err) {
    console.log('Error in deletePostComment: ', err)
    return { err: err, res: null }
  }
}

export const editPostComment = async (commentId: string, text: string) => {
  console.log('editPostComment: ', commentId, text);
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  try {
    const res = await axiosInstance.patch(
      `/post/comment/edit/${commentId}`,
      { text }, 
      { headers } 
    );
    return { res: res, err: null };
  } catch (err) {
    console.log('Error in editPostComment: ', err);
    return { err: err, res: null };
  }
};


/** DownVote Post `PATCH: /api/post/remove-upvote/:postId` */
export const removeVote = async (
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
    const res = await axiosInstance.patch(
      `/post/remove-upvote/${postId}`,
      data,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DELETE Post  `DELETE: /api/post/delete:postId` */

export const deletePost = async (post_id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(`/post/delete/${post_id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const searchPosts = async (searchCriteria: any) => {
  try {
    const queryParams = new URLSearchParams()
    for (const key in searchCriteria) {
      queryParams.append(key, searchCriteria[key])
    }
    const response = await axiosInstance.get(`/post/post-search?${queryParams}`)
    return { res: response.data, err: null }
  } catch (error) {
    console.error('Error searching for pages:', error)
    return { res: null, err: error }
  }
}

/** Update a User Post `POST: /api/post/user/update/:postId` */
export const updateUserPost = async (
  data: {
    hobbyId: string
    genreId: string | undefined
    content: string
    visibility: string
    media: []
    hasLink: Boolean
  },
  postId: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/post/user/update/${postId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update a Listing Page Post `POST: /api/post/listing/update/:postId` */
export const updateListingPost = async (
  data: {
    listingId: string
    hobbyId: string
    genreId: string | undefined
    content: string
    visibility: string
  },
  postId: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(
      `/post/listing/update/${postId}`,
      data,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
