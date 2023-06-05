import axiosInstance from './_axios'

/** Get Listing Detail `GET: /api/listing/?query` */
export const getListingPages = async (query: string) => {
  try {
    const res = await axiosInstance.get(`/listing/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getPages = async (id: any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/post/?author_type=Listing&_author=${id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Create New Listing `POST: /api/listing/` */
export const createNewListing = async (data: any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/listing/`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update Listing `PATCH: /api/listing/:listingId` */
export const updateListing = async (listingId: any, data: any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/listing/${listingId}`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get Listing Address `GET: /api/listing/address/:addressId` */
export const getListingAddress = async (addressId: string) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/listing/address/${addressId}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update Listing Address `PATCH: /api/listing/address/:addressId` */
export const updateListingAddress = async (addressId: string, data: any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/listing/address/${addressId}`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get Listing Hobbies `GET: /api/listing/hobby/:listingId` */
export const getListingHobbies = async (listingId: string) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.get(`/listing/hobby/${listingId}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Add Listing Hobby `POST: /api/listing/hobby/:listingId` */
export const addListingHobby = async (
  listingId: string,
  data: { hobbyId: string; genreId?: string },
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/listing/hobby/${listingId}`, data, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Delete Listing Hobby `DELETE: /api/listing/hobby/:listingId/?hobbyId={Hobby ID}` */
export const deleteListingHobby = async (listingId: string, hobbyId: string) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(`/listing/hobby/${listingId}/?hobbyId=${hobbyId}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Profile  `POST /api/user/?{query}`
 * - FormData Required Key: `user-profile` */
export const updateListingProfile = async (listingId: string, formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/listing/${listingId}/profile-image`, formData, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Cover  `POST /api/user/?{query}`
 * - FormData Required Key: `user-cover` */
export const updateListingCover = async (listingId: string, formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/listing/${listingId}/cover-image`, formData, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getListingTags = async () => {
  try {
    const res = await axiosInstance.get(`/listing/tag`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
