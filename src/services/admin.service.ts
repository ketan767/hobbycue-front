import axiosInstance, { operation } from './_axios'

/** Get dashboard Details `GET /api/user/?{query}`  */
export const admindashboard = async () => {
    try {
      const res = await axiosInstance.get(`/admin/dashboard`)
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }


/** Get `/api/admin/support` */
  export const getSupports = async (query: string,): Promise<ApiReturnObject> => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const res = await axiosInstance.get(`/admin/support/?${query}`, { headers })
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }


  /** Get `/api/admin/report` */
  export const getReports = async (query: string,): Promise<ApiReturnObject> => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const res = await axiosInstance.get(`/admin/report/?${query}`, { headers })
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }

  /** Get `/api/admin/contactUs` */
  export const getContactUs = async (query: string,): Promise<ApiReturnObject> => {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    try {
      const res = await axiosInstance.get(`/admin/contactUs/?${query}`, { headers })
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }

/** PATCH `/api/admin/user/:user_id` */

export const updateUserByAdmin = async (user_id: string,data:any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/user/${user_id}`,data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
/** DELETE `/api/admin/user/:user_id` */

export const deleteUserByAdmin = async (user_id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/user/${user_id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/listing/:listing_id` */

export const updateListingByAdmin = async (listing_id: string,data:any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/listing/${listing_id}`,data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DELETE `/api/admin/listing/:listing_id` */

export const deleteListingByAdmin = async (listing_id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/listing/${listing_id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/post/:post_id` */

export const updatePostByAdmin = async (post_id: string,data:any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/post/${post_id}`,data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DELETE `/api/admin/post/:post_id` */

export const deletePostByAdmin = async (post_id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/post/${post_id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}


/** Get `/api/admin/hobbyreq` */
export const getHobbyRequests = async (query: string,): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/hobbyreq/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/hobbyreq` */
export const getClaimRequests = async (query: any,): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/claimreq/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/hobbyreq` */
export const getsearchHistory = async (query: any,): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/search-history/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}


/** Get `/api/admin/hobbyreq` */
export const getCommunities = async (): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/countUsersByHobbyAndCity`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

