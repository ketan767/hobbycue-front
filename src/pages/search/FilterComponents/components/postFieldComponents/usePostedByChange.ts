import { setUserName } from '@/redux/slices/search'
import { getUsersByName } from '@/services/user.service'
import { isEmptyField } from '@/utils'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export default function usePostedByChange(
  setFocusedPostedByIdx: (num: number) => void,
  setPostedByDropdownList: (names: string[]) => void,
) {
  const dispatch = useDispatch()
  const handlePostedByChange = useCallback(
    async (e: any) => {
      dispatch(setUserName(e.target.value))

      setFocusedPostedByIdx(-1)

      if (isEmptyField(e.target.value)) return setPostedByDropdownList([])

      const query = `name=${e.target.value}`
      const { err, res } = await getUsersByName(query)

      if (err) return console.log(err)
      const fetchedNames = res.data.data?.map(
        (person: any) => person?.full_name,
      )
      setPostedByDropdownList(fetchedNames)
    },
    [dispatch, setFocusedPostedByIdx, setPostedByDropdownList],
  )
  return handlePostedByChange
}
