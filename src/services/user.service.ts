import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllUserDetail = async (query: string): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/user/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

// Get LoggedIn User Detail
export const getMyProfileDetail = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const query = 'populate=_hobbies,_addresses,primary_address,_listings'
  try {
    const res = await axiosInstance.get(`/user/me?${query}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

// Update User
export const updateMyProfileDetail = async (data: UpdateProfilePayload, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .patch(`/user/me`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Update User Hobby
export const addUserHobby = async (
  data: {
    hobby: string
    genre?: string
    level: number
  },
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/hobby`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Delete User Hobby
export const deleteUserHobby = async (id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(`/user/hobby/${id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    return { err: error, res: null }
  }
}

// Add new user address
export const addUserAddress = async (data: ProfileAddressPayload, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/address`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Update User Address using ID
export const updateUserAddress = async (
  id: string,
  data: ProfileAddressPayload,
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .patch(`/user/address/${id}`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Update User Hobby
export const checkProfileUrl = async (url: string, cb: CallbackFunction) => {
  await axiosInstance
    .get(`/user/check-profile-url/${url}`)
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Update User Hobby
export const uploadPhoto = async (formData: FormData) => {
  try {
    const res = await axiosInstance.post(`/upload-image`, formData)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
