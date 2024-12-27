import { closeModal } from '@/redux/slices/modal'
import { increaseRefreshNum, setFilters } from '@/redux/slices/post'
import { updateActiveProfile } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import {
  createListingPost,
  createUserPost,
  updateListingPost,
  updateUserPost,
} from '@/services/post.service'
import DOMPurify from 'dompurify'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

export default function useHandleSubmit(
  data: any,
  editBoxRef: any,
  errors: any,
  setErrors: any,
  setSnackbar: any,
  selectedHobbies: any,
  propData: any,
  hasLink: any,
  setSubmitBtnLoading: any,
  editing: any,
) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.user)

  const handleSubmit = async () => {
    if (data.content === '' || data.content === '<p><br></p>') {
      console.log(data.content)
      if (editBoxRef.current) {
        editBoxRef.current.scrollTo(0, 0)
      }
      return setErrors({
        ...errors,
        content: 'This field is required',
      })
    }
    if (selectedHobbies.length === 0) {
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Please select atleast one hobby',
      })
      return
    }
    const allHobbyIds = selectedHobbies.map((h: any) => h.hobbyId)
    const allGenreIds = selectedHobbies.map((h: any) => h.genreId)
    console.log('allHobbyIds', allHobbyIds)
    console.log('allGenreIds', allGenreIds)
    console.log('propsdata', propData)

    const jsonData: any = {
      hobbyId1: allHobbyIds[0],
      hobbyId2: allHobbyIds[1] ? allHobbyIds[1] : '',
      hobbyId3: allHobbyIds[2] ? allHobbyIds[2] : '',
      genreId1: allGenreIds[0] ? allGenreIds[0] : '',
      genreId2: allGenreIds[1] ? allGenreIds[1] : '',
      genreId3: allGenreIds[2] ? allGenreIds[2] : '',

      content: DOMPurify.sanitize(data.content),
      visibility: data.visibility,
      media:
        // hasLink && showMetaData ? [...data.media, metadataImg] :
        data.media,
      has_link: hasLink,
      video_url: data.video_url ? data.video_url : null,
    }

    setSubmitBtnLoading(true)

    if (data.type === 'listing') {
      jsonData.listingId = data.data._id
      const { err, res } = editing
        ? await updateListingPost(jsonData, propData._id)
        : await createListingPost(jsonData)
      setSubmitBtnLoading(false)
      if (err) {
        return console.log(err)
      }
      if (res.data.success) {
        // store.dispatch(
        //   setFilters({
        //     location: data.visibility !== '' ? data.visibility : null,
        //     hobby: data.hobby?._id ?? '',
        //     genre: data.genre?._id ?? '',
        //   }),
        // )
        dispatch(updateActiveProfile({ type: data.type, data: data.data }))
        dispatch(closeModal())
        // window.location.reload()
        let seeMore = false
        const selectedHobby = allHobbyIds[0]
        const selectedGenre = allGenreIds[0]
        user._hobbies?.forEach((hobb: any, index: number) => {
          if (selectedGenre && selectedHobby) {
            if (
              hobb?.genre?._id === selectedGenre &&
              hobb?.hobby?._id === selectedHobby &&
              index > 2
            ) {
              seeMore = true
            }
          } else if (selectedHobby) {
            if (hobb?.genre?._id) {
            } else if (hobb?.hobby?._id === selectedHobby && index > 2) {
              seeMore = true
            }
          }
        })

        if (allGenreIds[0]) {
          console.log('genres')
          dispatch(
            setFilters({
              hobby: allHobbyIds[0],
              location: data.visibility,
              genre: allGenreIds[0],
              seeMoreHobbies: seeMore,
            }),
          )
        } else {
          console.log('hobby')

          dispatch(
            setFilters({
              hobby: allHobbyIds[0],
              location: data.visibility,
              genre: 'No genre',
              seeMoreHobbies: seeMore,
            }),
          )
        }
        dispatch(increaseRefreshNum())
        if (router.pathname === '/community') {
          router.push('/community')
        }
      }
      return
    }

    const { err, res } = editing
      ? await updateUserPost(jsonData, propData?._id)
      : await createUserPost(jsonData)

    setSubmitBtnLoading(false)

    if (err) {
      return console.log(err)
    }
    if (res.data.success) {
      dispatch(updateActiveProfile({ type: data.type, data: data.data }))
      dispatch(closeModal())
      // window.location.reload()
      let seeMore = false
      const selectedHobby = allHobbyIds[0]
      const selectedGenre = allGenreIds[0]
      user._hobbies?.forEach((hobb: any, index: number) => {
        if (selectedGenre && selectedHobby) {
          if (
            hobb?.genre?._id === selectedGenre &&
            hobb?.hobby?._id === selectedHobby &&
            index > 2
          ) {
            seeMore = true
          }
        } else if (selectedHobby) {
          if (hobb?.genre?._id) {
          } else if (hobb?.hobby?._id === selectedHobby && index > 2) {
            seeMore = true
          }
        }
      })

      if (allGenreIds[0]) {
        console.log('genres')
        dispatch(
          setFilters({
            hobby: allHobbyIds[0],
            location: data.visibility,
            genre: allGenreIds[0],
            seeMoreHobbies: seeMore,
          }),
        )
      } else {
        console.log('hobby')

        dispatch(
          setFilters({
            hobby: allHobbyIds[0],
            location: data.visibility,
            genre: 'No genre',
            seeMoreHobbies: seeMore,
          }),
        )
      }
      dispatch(increaseRefreshNum())
      if (router.pathname === '/community') {
        router.push('/community')
      }
    }
  }
  return handleSubmit
}
