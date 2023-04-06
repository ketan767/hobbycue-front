import axiosInstance, { operation } from './_axios'

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

export const getAllHobbies = (q: string | null, cb: (err: any, res: any) => void) => {
  operation.attempt((currentAttempt) => {
    axiosInstance
      .get(`/hobby?${q}`)
      .then((res) => cb(null, res))
      .catch((err) => {
        if (operation.retry(err)) {
          console.log(`Retry attempt ${currentAttempt} due to error: {err.message}`)
          return
        }
        return
        // cb(err, null)
      })
  })
}
