import axiosInstance, { operation } from './_axios'

export const getAllHobbies = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
