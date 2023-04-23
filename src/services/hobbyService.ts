import axiosInstance, { operation } from './_axios'

type callback = (err: any, res: any) => void

// axios.get('https://example.com/api/data')
//   .then((response) => {
//     console.log('Response received:', response.data);
//   })
//   .catch((error) => {
//     if (operation.retry(error)) {
//       console.log(`Retry attempt ${currentAttempt} due to error: ${error.message}`);
//       return;
//     }
//     console.log('Max retries exceeded');
//   });

export const getAllHobbies = async (query: string | null, cb: callback) => {
  await axiosInstance
    .get(`/hobby?${query}`)
    .then((res) => cb(null, res))
    .catch((err) => cb(err, null))
}
