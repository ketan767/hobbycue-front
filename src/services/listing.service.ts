import axiosInstance from './_axios'

export const getListingPageDetail = async (query: string): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/listing/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
