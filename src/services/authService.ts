import axiosInstance, { operation } from './_axios'

type callback = (err: any, res: any) => void

interface signInPayload {
  email: string
  password: string
}

// Sign In
export const signIn = (data: signInPayload, cb: callback) => {
  operation.attempt((currentAttempt) => {
    axiosInstance
      .post(`/auth/signin`, data)
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

// Sign Up to get the OTP
export const joinIn = (data: signInPayload, cb: callback) => {
  operation.attempt((currentAttempt) => {
    axiosInstance
      .post(`/auth/signup`, data)
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

interface registerPayload {
  email: string
  otp: string
}

// Register the user after Verifying the OTP
export const register = (data: registerPayload, cb: callback) => {
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
