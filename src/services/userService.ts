import axiosInstance, { operation } from './_axios'

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
export const getMyProfileDetail = async (query: string, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .get(`/user/me?${query}`, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

export type UpdateProfileData = {
  full_name?: string
  tagline?: string
  display_name?: string
  profile_url?: string
  gender?: 'male' | 'female' | null
  year_of_birth?: string
  phone?: string
  website?: string
  about?: string

  street?: string
  society?: string
  locality?: string
  city?: string
  pin_code?: string
  state?: string
  country?: string
  latitude?: string
  longitude?: string

  is_onboarded?: boolean
}

// Update User
export const updateMyProfileDetail = async (data: UpdateProfileData, cb: CallbackFunction) => {
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

export type ProfileAddressData = {
  street: string
  society: string
  locality: string
  city: string
  pin_code: string
  state: string
  country: string
  latitude: string
  longitude: string
  set_as_primary?: boolean
}
// Add new user address
export const addUserAddress = async (data: ProfileAddressData, cb: CallbackFunction) => {
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
  data: ProfileAddressData,
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

// @FIX
interface registerPayload {
  email: string
  otp: string
}

// Register the user after Verifying the OTP
export const register = (data: registerPayload, cb: CallbackFunction) => {
  operation.attempt((currentAttempt) => {
    axiosInstance
      .post(`/auth/register`, data)
      .then((res) => cb(null, res))
      .catch((err) => {
        if (!err.response?.data?.success && operation.retry(err)) {
          console.log({ endPoint: '', attempt: currentAttempt, messgae: err.message })
          return
        }
        cb(err, null)
      })
  })
}
