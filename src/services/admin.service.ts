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