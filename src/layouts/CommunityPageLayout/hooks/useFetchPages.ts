import {  updatePages, updatePagesLoading } from '@/redux/slices/post'
import { RootState } from '@/redux/store'
import { getListingPages } from '@/services/listing.service'
import { useDispatch, useSelector } from 'react-redux'

function filterListingsByHobbyDisplayNames(
  listings: any,
  hobbyId: any,
  genreId: any,
) {
  return listings.filter((listing: any) =>
    listing._hobbies.some((hobby: any) => {
      if (genreId) {
        return hobby.genre?._id === genreId && hobby.hobby._id === hobbyId
      }
      return hobby.hobby._id === hobbyId
    }),
  )
}
export default function useFetchPages() {
  const dispatch = useDispatch()
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const fetchPages = async (
    selectedHobby: string,
    selectedGenre: string | undefined,
  ) => {
    if (selectedHobby === undefined || !activeProfile?.data?._hobbies) return
    const params = new URLSearchParams(
      `populate=_hobbies,_address&is_published=true&type=1&type=2&type=3`,
    )

    const { err, res } = await getListingPages(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      let filteredPages = []
      if (selectedHobby === 'All Hobbies') {
        filteredPages = res.data.data.listings
      } else if (selectedHobby === 'My Hobbies') {
        filteredPages = res.data.data.listings
      } else {
        filteredPages = filterListingsByHobbyDisplayNames(
          res.data.data.listings,
          selectedHobby,
          selectedGenre,
        )
      }
      console.log('filteredPages', filteredPages)
      dispatch(updatePages(filteredPages))
      dispatch(updatePagesLoading(false))
    }
  }
  return fetchPages
}
