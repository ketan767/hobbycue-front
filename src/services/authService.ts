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
        if (operation.retry(err)) {
          console.log({ endPoint: '', attempt: currentAttempt, messgae: err.message })
          return
        }
        cb(err, null)
      })
  })
}
