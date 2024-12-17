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
export const getAdminHobbies = async (
  query: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/hobby/?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/support` */
export const getSupports = async (query: string): Promise<ApiReturnObject> => {
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
export const getReports = async (query: string): Promise<ApiReturnObject> => {
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
export const getContactUs = async (query: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/contactUs/?${query}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/user/:user_id` */

export const updateUserByAdmin = async (
  user_id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/user/${user_id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
/** DELETE `/api/admin/user/:user_id` */

export const deleteUserByAdmin = async (
  user_id: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/user/${user_id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/listing/:listing_id` */

export const updateListingByAdmin = async (
  listing_id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(
      `/admin/listing/${listing_id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update Listing Address `PATCH: /api/admin/address/:addressId` */
export const updateListingAddressByAdmin = async (
  addressId: string,
  data: any,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(
      `/admin/listing/address/${addressId}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DELETE `/api/admin/listing/:listing_id` */

export const deleteListingByAdmin = async (
  listing_id: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/listing/${listing_id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/post/:post_id` */

export const updatePostByAdmin = async (
  post_id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/post/${post_id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** DELETE `/api/admin/post/:post_id` */

export const deletePostByAdmin = async (
  post_id: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.delete(`/admin/post/${post_id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** PATCH `/api/admin/hobby/:hobby_id` */

export const updateHobbyByAdmin = async (
  hobby_id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearerhobby_id ${token}` }
  try {
    const res = await axiosInstance.patch(`/admin/hobby/${hobby_id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/hobbyreq` */
export const getHobbyRequests = async (
  query: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/hobbyreq/?${query}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/hobbyreq` */
export const getClaimRequests = async (
  query: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/admin/claimreq/?${query}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get `/api/admin/hobbyreq` */
export const getsearchHistory = async (
  query: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  let url = `/admin/search-history?${query}`
  console.log(url)

  try {
    const res = await axiosInstance.get(url, {
      headers,
    })
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
    const res = await axiosInstance.get(`/admin/countUsersByHobbyAndCity`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Post `/api/admin/hobbyreq` */
export const UpdateClaim = async (data: any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(`/admin/claimreq`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Post `/api/admin/hobbreq` */
export const UpdateHobbyreq = async (data: any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(`/admin/hobbyreq`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const updateHobbyProfile = async (hobbyId: any, formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(
      `/admin/hobby/profile-image`,
      formData,
      {
        headers,
        params: { hobbyId },
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Cover  `POST /user/me/cover-image`
 * - FormData Required Key: `user-cover` */
export const updateHobbyCover = async (hobbyId: any, formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  formData.append('hobbyId', hobbyId)
  try {
    const res = await axiosInstance.post(`/admin/hobby/cover-image`, formData, {
      headers,
      params: { hobbyId },
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const getBrand = async (): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/brand`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const updateBrand = async (
  brand_id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearerhobby_id ${token}` }
  try {
    const res = await axiosInstance.patch(
      `/brand/updateBrand/${brand_id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getTips = async (): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/tips`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const updateTips = async (tip_id: string,data:any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearerhobby_id ${token}` }
  try {
    const res = await axiosInstance.patch(`/tips/updateTips/${tip_id}`,data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}


export const getTestimonials = async (): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`/testimonials`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const updateTestimonials = async (testimonial_id: string,data:any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearerhobby_id ${token}` }
  try {
    const res = await axiosInstance.patch(`/testimonials/updateTestimonials/${testimonial_id}`,data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
