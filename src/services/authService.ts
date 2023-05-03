import axiosInstance, { operation } from './_axios'

// Sign In
export const signIn = (data: SignInPayload, cb: CallbackFunction) => {
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
export const joinIn = (data: SignInPayload, cb: CallbackFunction) => {
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

// Register the user after Verifying the OTP
export const register = (data: RegisterPayload, cb: CallbackFunction) => {
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
