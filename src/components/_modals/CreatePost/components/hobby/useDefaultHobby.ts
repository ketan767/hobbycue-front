import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export default function useGetDefaultHobby() {
  const { user, activeProfile } = useSelector((state: RootState) => state.user)
  const defaultFirstHobby = () => {
    let firstHobby =
      activeProfile?.data?.preferences?.create_post_pref?.preferred_hobby?.hobby
        ?.display
    let firstGenre =
      activeProfile?.data?.preferences?.create_post_pref?.preferred_hobby?.genre
        ?.display
    let firstHobbyId = activeProfile?.data?.preferences?.create_post_pref
      ?.preferred_hobby?.hobby?._id
      ? activeProfile?.data?.preferences?.create_post_pref?.preferred_hobby
          ?.hobby?._id
      : undefined
    let firstGenreId = activeProfile?.data?.preferences?.create_post_pref
      ?.preferred_hobby?.genre?._id
      ? activeProfile?.data?.preferences?.create_post_pref?.preferred_hobby
          ?.genre?._id
      : undefined

    if (!firstHobby) {
      firstHobby = user._hobbies[0]?.hobby?.display
      firstGenre = user._hobbies[0]?.genre?.display
      firstHobbyId = user._hobbies[0]?.hobby?._id
      firstGenreId = user._hobbies[0]?.genre?._id
    }
    return { firstHobby, firstGenre, firstHobbyId, firstGenreId }
  }
  return defaultFirstHobby
}