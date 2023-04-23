import axiosInstance, { operation } from './_axios'

type CallbackFunction = (err: any, res: any) => void

export const getAllUserDetail = async (query: string, cb?: CallbackFunction): Promise<any> => {
  try {
    const res = await axiosInstance.get(`/user/?${query}`)
    return res.data
  } catch (error) {
    console.error(error)
    return null
  }
}

// Get LoggedIn User Detail
export const getMyUserDetail = async (cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .get(`/user/me`, { headers })
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
export const updateMyUserDetail = async (data: UpdateProfileData, cb: CallbackFunction) => {
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
    genre: string
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
}
// Update User Hobby
export const addUserAddress = async (data: ProfileAddressData, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/address`, data, { headers })
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
