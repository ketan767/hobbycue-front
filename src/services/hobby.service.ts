import axiosInstance, { operation } from './_axios'

/** Get All Hobbies `GET: /api/listing/?query` */
export const getAllHobbies = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
