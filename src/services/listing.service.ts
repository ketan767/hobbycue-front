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
export const getListingSearch = async (query: string) => {
  try {
    const res = await axiosInstance.get(`/listing/listing-search/?${query}`)
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
    const res = await axiosInstance.get(
      `/post/?author_type=Listing&_author=${id}&populate=_author,_hobby,_genre`,
      { headers },
    )
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
    const res = await axiosInstance.patch(`/listing/${listingId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const deleteRelatedListingLeft = async (
  listingId: string,
  relatedListingId: string,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/listing/${listingId}`,
      {
        related_listings_left: {
          listings: [relatedListingId],
        },
      },
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const deleteRelatedListingRight = async (
  listingId: string,
  relatedListingId: string,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(
      `/listing/${listingId}`,
      {
        related_listings_right: {
          listings: [relatedListingId],
        },
      },
      {
        headers,
      },
    )
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
    const res = await axiosInstance.get(`/listing/address/${addressId}`, {
      headers,
    })
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
    const res = await axiosInstance.patch(
      `/listing/address/${addressId}`,
      data,
      { headers },
    )
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
    const res = await axiosInstance.get(`/listing/hobby/${listingId}`, {
      headers,
    })
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
    const res = await axiosInstance.post(`/listing/hobby/${listingId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Add Listing Hobby `POST: /api/listing/:listingId/reviews` */
export const addListingReview = async (
  listingId: string,
  data: { text: string; user_id?: string },
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(
      `/listing/${listingId}/reviews`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** update Listing Hobby `POST: /api/listing/:reviewId/reviews` */
export const editListingReview = async (
  reviewId: string,
  data: { is_published?: any },
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/listing/reviews/${reviewId}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Delete Listing Hobby `POST: /api/listing/:reviewId/reviews` */
export const deleteListingReview = async (reviewId: string) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(`/listing/reviews/${reviewId}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
/** Delete Listing Hobby `DELETE: /api/listing/hobby/:listingId/?hobbyId={Hobby ID}` */
export const deleteListingHobby = async (
  listingId: string,
  hobbyId: string,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(
      `/listing/hobby/${listingId}/?hobbyId=${hobbyId}`,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Profile  `POST /api/user/?{query}`
 * - FormData Required Key: `user-profile` */
export const updateListingProfile = async (
  listingId: string,
  formData: FormData,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(
      `/listing/${listingId}/profile-image`,
      formData,
      {
        headers,
      },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Cover  `POST /api/user/?{query}`
 * - FormData Required Key: `user-cover` */
export const updateListingCover = async (
  listingId: string,
  formData: FormData,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(
      `/listing/${listingId}/cover-image`,
      formData,
      {
        headers,
      },
    )
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

export const searchPages = async (searchCriteria: any) => {
  try {
    const queryParams = new URLSearchParams()
    for (const key in searchCriteria) {
      queryParams.append(key, searchCriteria[key])
    }
    const response = await axiosInstance.get(
      `/listing/listing-search-all?${queryParams}`,
    )
    return { res: response.data, err: null }
  } catch (error) {
    console.error('Error searching for pages:', error)
    return { res: null, err: error }
  }
}
export const searchPagesRelated = async (searchCriteria: any) => {
  try {
    const queryParams = new URLSearchParams()
    for (const key in searchCriteria) {
      queryParams.append(key, searchCriteria[key])
    }
    const response = await axiosInstance.get(
      `/listing/listing-search?${queryParams}`,
    )
    return { res: response.data, err: null }
  } catch (error) {
    console.error('Error searching for pages:', error)
    return { res: null, err: error }
  }
}

export const GetListingEvents = async (search_id: any, relation?: string) => {
  try {
    const queryParams = new URLSearchParams({
      search_id,
      relation: relation || '',
    })

    const res = await axiosInstance.get(
      `/listing/listing-events/?${queryParams}`,
    )
    return { res: res.data, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllListingUrls = async (): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/listing/urls`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const ReportListing = async (
  data: ReportPayload,
): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/listing/listing-report`, data)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

export const checkListingUrl = async (url: string, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  await axiosInstance
    .get(`/listing/check-page-url/${url}`, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

export const getAllListingPageTypes = async (): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/listing/page-types`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllListingCategories = async (): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`listing/listing-categories`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllListingRelationTypes = async (query: string) => {
  try {
    const res = await axiosInstance.get(`listing/relation-types/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getAllEventRelationTypes = async (query: string) => {
  try {
    const res = await axiosInstance.get(
      `listing/event-relation-types/?${query}`,
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getProductVariant = async (
  id: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`listing/product-variant/${id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const addProductVariant = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(
      `listing/product-variant/${id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const updateProductVariant = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(
      `listing/product-variant/${id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getPlaceVariant = async (
  id: string,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`listing/place-variant/${id}`, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const addPlaceVariant = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(
      `listing/place-variant/${id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const updatePlaceVariant = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(
      `listing/place-variant/${id}`,
      data,
      { headers },
    )
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const purchaseProduct = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(`listing/purchase/${id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}
export const purchasePlaceMembership = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(`listing/purchase-membership/${id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const upadtePlaceMembership = async (
  id: string,
  data: any,
): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.patch(`listing/place-membership-update/${id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const getPurchases = async (id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.get(`listing/purchases/${id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const transferListing = async (data: any): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const res = await axiosInstance.post(`/listing/transfer`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}

export const getAllEvents = async (): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/listing/all-events-ascending`)
    return { res: res, err: null }
  } catch (error: any) {
    return { err: error, res: null }
  }
}
