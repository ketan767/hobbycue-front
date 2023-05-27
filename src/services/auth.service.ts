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
    const res = await axiosInstance.post(`/auth/signup`, {...data, profile_url: ''})
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}
/** Register the user after Verifying the OTP `POST: /api/auth/register/` */
export const register = async (data: RegisterPayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/auth/register`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}
