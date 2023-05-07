import axiosInstance, { operation } from './_axios'

export const getAllPosts = async (query: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/post/?${query}`, { headers })
    return Promise.resolve({ res: res, err: null })
  } catch (error) {
    console.error(error)
    return Promise.reject({ err: error, res: null })
  }
}

export const createUserPost = async (data: any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/post/user/`, data, { headers })
    return Promise.resolve({ res: res, err: null })
  } catch (error) {
    console.error(error)
    return Promise.reject({ err: error, res: null })
  }
}
