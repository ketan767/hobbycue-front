import axiosInstance from "./_axios"

export const getSocialNetworks = async (

): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`social-networks`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}