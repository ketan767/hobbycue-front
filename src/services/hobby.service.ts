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

export const getHobbyMembers = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/user/?fields=full_name,slug,profile_image&_hobbies=${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
