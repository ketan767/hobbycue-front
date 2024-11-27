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

export const getAllHobbiesWithoutPagi = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/withoutPagi?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const searchAllHobbies = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/searchAllHobbies?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getTrendingHobbies = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/trending?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}



export const getHobbyMembersCommunity = async (id: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/members/community/${id}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getHobbyMembers = async (id: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/members/${id}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const getHobbyPages = async (query: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/pages?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getHobbyBlogs = async (display: string | null): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/hobby/blogs?display=${display}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllHobbiesUrls = async (

  ): Promise<ApiReturnObject> => {
    try {
      const res = await axiosInstance.get(`/hobby/urls`)
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }
  export const SendHobbyRequest = async (data:any): Promise<ApiReturnObject> => {
    try {
      const res = await axiosInstance.post(`/hobby/hobbyRequest`,data)
      return { res: res, err: null }
    } catch (error) {
      console.error(error)
      return { err: error, res: null }
    }
  }
  