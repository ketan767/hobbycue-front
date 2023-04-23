import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios'
import retry from 'retry'

export const operation = retry.operation({
  retries: 3,
  factor: 2,
  minTimeout: 1000,
  maxTimeout: 10000,
  randomize: true,
})

// Create an Axios instance with the base URL and default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  // baseURL: 'https://hobbycue-back.onrender.com/api',
})

// Add a request interceptor to add the authentication token to every request
// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }

//   return config
// })

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response.status === 401) {
      // Handle unauthorized error
      console.log('401')
    }

    if (error.response.status === 404) {
      // Handle not found error
      console.log('404')
    }

    // Handle other errors
    console.log('Other Error')
    console.log(error)
    return Promise.reject(error)
  },
)

export default axiosInstance
