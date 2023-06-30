import axiosInstance, { operation } from './_axios'

/** Sign In `POST: /api/auth/signin/` */
export const signIn = async (data: SignInPayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/signin`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}
/** Sign Up `POST: /api/auth/signup/` */
export const joinIn = async (data: SignInPayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/signup`, {
      ...data,
      profile_url: '',
    })
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

/** Register the user after Verifying the OTP `POST: /api/auth/register/` */
export const register = async (
  data: RegisterPayload,
): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/register`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

/** Register/Login using Facebook `POST: /api/auth/facebook/` */
export const facebookAuth = async (data: {
  userId: String
  accessToken: String
  name: String
}): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/facebook`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

/** Register/Login using Google `POST: /api/auth/google/` */
export const googleAuth = async (data: {
  googleId: String
  tokenId: String
  name: String
}): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/google`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/auth/change-password`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

export const forgotPassword = async (
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/auth/forgot-password`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

export const resetPassword = async (
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/auth/forgot-password`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}
