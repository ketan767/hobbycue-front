import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllBlogs = async (
    query: string,
  ): Promise<ApiReturnObject> => {
    try {
      const res = await axiosInstance.get(`/blogs/?${query}`)
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }