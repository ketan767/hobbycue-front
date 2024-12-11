import {
  setUserHobby,
  setUserLocation,
  setUserName,
} from '@/redux/slices/search'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

export default function useHandleUserProfileSearch() {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleUserProfileSearch = (
    currUserName: string,
    selectedHobby: string,
    selectedLocation: string,
  ) => {
    dispatch(setUserName(currUserName))
    dispatch(setUserHobby(selectedHobby))
    dispatch(setUserLocation(selectedLocation))

    const query: Record<string, string> = { filter: 'users' }
    if (currUserName) query.name = currUserName
    if (selectedHobby) query.hobby = selectedHobby
    if (selectedLocation) query.location = selectedLocation

    console.log('currUserName', currUserName)
    console.log('selectedHobby', selectedHobby)
    console.log('selectedLocation', selectedLocation)
    router.push({
      pathname: '/search',
      query,
    })
  }

  return handleUserProfileSearch
}
