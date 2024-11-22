import axiosInstance, { operation } from './_axios'

/** Get User Details `GET /api/user/?{query}`  */
export const getAllUserDetail = async (
  query: string,
): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/user/?${query}`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Get LoggedIn User Detail `GET /api/user/me/?{query}` */
export const getMyProfileDetail = async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const query = 'populate=_hobbies,_addresses,primary_address,_listings'
  try {
    const res = await axiosInstance.get(`/user/me?${query}`, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update LoggedIn User Detail `PATCH /api/user/me/` */
export const updateMyProfileDetail = async (data: UpdateProfilePayload) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/user/me`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    console.error(error)
    return { err: error, res: null }
  }
}


/** Update LoggedIn User Detail `PATCH /api/user/me/` */
export const updateMyProfileUrl = async (id:any, data:any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/user/update-profile-url/${id}`, data, { headers })
    return { res: res, err: null }
  } catch (error: any) {
    console.error(error)
    return { err: error, res: null }
  }
}

// Update User Hobby
export const addUserHobby = async (
  data: {
    hobby: string
    genre?: string
    level: number
  },
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/hobby`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}
export const addUserHobbies = async (
  data: {
    hobbies: {
      hobby: string
      genre: string
      level: number
    }[]
  },
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/hobbies`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

export const updateUserHobbyLevel = async (id: string, data: any) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.patch(`/user/hobby/${id}`, data, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    return { err: error, res: null }
  }
}

// Delete User Hobby
export const deleteUserHobby = async (id: string): Promise<ApiReturnObject> => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.delete(`/user/hobby/${id}`, { headers })
    return { res: res, err: null }
  } catch (error) {
    return { err: error, res: null }
  }
}

// Add new user address
export const addUserAddress = async (
  data: ProfileAddressPayload,
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .post(`/user/address`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

// Update User Address using ID
export const updateUserAddress = async (
  id: string,
  data: ProfileAddressPayload,
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .patch(`/user/address/${id}`, data, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

//delet address
export const deleteUserAddress = async (
  id: string,
  cb: CallbackFunction,
) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  await axiosInstance
    .delete(`/user/address/${id}`, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}
// Update User Hobby
export const checkProfileUrl = async (url: string, cb: CallbackFunction) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }
  await axiosInstance
    .get(`/user/check-profile-url/${url}`, { headers })
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}

/** Update User Profile  `POST /user/me/profile-image`
 * - FormData Required Key: `user-profile` */
export const updateUserProfile = async (formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/user/me/profile-image`, formData, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

/** Update User Cover  `POST /user/me/cover-image`
 * - FormData Required Key: `user-cover` */
export const updateUserCover = async (formData: FormData) => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    const res = await axiosInstance.post(`/user/me/cover-image`, formData, {
      headers,
    })
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}


export const searchUsers = async (searchCriteria:any) => {
  try {
  
    const queryParams = new URLSearchParams();
    for (const key in searchCriteria) {
      if (searchCriteria.hasOwnProperty(key)) {
        queryParams.append(key, searchCriteria[key]);
      }
    }
    console.log(`/user/user-search?${queryParams.toString()}`);
    
    const response = await axiosInstance.get(`/user/user-search?${queryParams.toString()}`);
    return { res: response.data, err: null };
  } catch (error) {
    console.error('Error searching for users:', error);
    return { res: null, err: error };
  }
};

export const getAllUserUrls = async (

): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/user/urls`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

export const addContactUs = async (data: ContactUspayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/user/add-contact`, data);
    return { res: res, err: null };
  } catch (error: any) {
    return { err: error, res: null };
  }
};


export const support = async (data: supportPayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/user/add-support`, data);
    return { res: res, err: null };
  } catch (error: any) {
    return { err: error, res: null };
  }
};


export const ReportUser = async (data: ReportPayload): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/user/user-report`, data);
    return { res: res, err: null };
  } catch (error: any) {
    return { err: error, res: null };
  }
};

export const addSearchHistory = async (data: {search_input:string, no_of_pages:number, user_id: any}): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.post(`/user/search-history`, data,);
    return { res: res, err: null };
  } catch (error: any) {
    return { err: error, res: null };
  }
};

export const TrendingHobbiesByUser = async (): Promise<ApiReturnObject> => {
  try {
    const res = await axiosInstance.get(`/user/trending-hobbies`)
    return { res: res, err: null }
  } catch (error) {
    console.error(error)
    return { err: error, res: null }
  }
}

interface NotifyMaintenanceArgsType {
  username?: string
  email: string
}

export const notifyMaintenance = async ({
  username = '',
  email,
}: NotifyMaintenanceArgsType) => {
  try {
    const body = { username, email }
    const res = await axiosInstance.post(`/under-maintenance`, body)
    return { res, err: null }
  } catch (err) {
    return { res: null, err }
  }
}