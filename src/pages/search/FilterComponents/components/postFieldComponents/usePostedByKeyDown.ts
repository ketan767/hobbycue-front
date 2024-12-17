import { setPostedBy } from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function usePostedByKeyDown(
  postedByRef: React.RefObject<HTMLDivElement>,
  setFocusedPostedByIdx: React.Dispatch<React.SetStateAction<number>>,
  postedByDropdownList: string[],
  focusedPostedByIdx: number,
  showPostedByDropdown: boolean,
  setShowPostedByDropdown: React.Dispatch<React.SetStateAction<boolean>>,
  isPostedBySelected: boolean,
  setIsPostedBySelected: React.Dispatch<React.SetStateAction<boolean>>,
  selectedHobby: string,
  selectedLocation: string,
  setCurrPostedBy: (name:string) => void,
  filterPage?: string,
) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { filter } = router.query
  const { postedBy, userHobby, userLocation } = useSelector(
    (state: RootState) => state.search,
  )
  const handlePostedByKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          setFocusedPostedByIdx((prevIndex) =>
            prevIndex < postedByDropdownList.length - 1
              ? prevIndex + 1
              : prevIndex,
          )
          console.log('focusedpostedBy', focusedPostedByIdx)
          console.log('Down Arrow')
          break
        case 'ArrowUp':
          setFocusedPostedByIdx((prevIndex: number) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex,
          )
          break

        case 'Enter':
          e.stopPropagation()
          if (postedBy.length !== 0 && focusedPostedByIdx === -1) {
            //AddButtonRef.current?.click()
            if (filter === 'users') {
              let query = {}
              query = { ...query, filter: 'users' }
              if (postedBy) {
                query = { ...query, postedBy: postedBy }
              }
              if (userHobby) {
                query = { ...query, hobby: userHobby }
              }
              if (userLocation) {
                query = { ...query, location: userLocation }
              }
              router.push({
                pathname: `/search`,
                query: query,
              })
            } else if (filterPage && filterPage === 'Post') {
              let query = {}
              query = { ...query, filter: 'posts' }
              if (postedBy) {
                query = { ...query, name: postedBy }
              }
              if (selectedHobby) {
                query = { ...query, hobby: selectedHobby }
              }
              if (selectedLocation) {
                query = { ...query, location: selectedLocation }
              }
              router.push({
                pathname: `/search`,
                query: query,
              })
            }
          } else if (focusedPostedByIdx !== -1) {
            setShowPostedByDropdown(false)
            if (showPostedByDropdown) {
              const val = postedByDropdownList[focusedPostedByIdx] || postedBy
              dispatch(setPostedBy(val))
              setCurrPostedBy(val)
              console.log('name', val)
            }

            if (isPostedBySelected) {
              if (filter === 'posts') {
                let query = {}
                query = { ...query, filter: 'posts' }
                if (postedBy) {
                  query = { ...query, postedBy: postedBy }
                }
                if (userHobby) {
                  query = { ...query, hobby: userHobby }
                }
                if (userLocation) {
                  query = { ...query, location: userLocation }
                }
                router.push({
                  pathname: `/search`,
                  query: query,
                })
              } else if (filterPage && filterPage === 'Post') {
                let query = {}
                query = { ...query, filter: 'posts' }
                if (postedBy) {
                  query = { ...query, postedBy: postedBy }
                }
                if (selectedHobby) {
                  query = { ...query, hobby: selectedHobby }
                }
                if (selectedLocation) {
                  query = { ...query, location: selectedLocation }
                }
                router.push({
                  pathname: `/search`,
                  query: query,
                })
              }
            }
            console.log("isPostedBySelected",isPostedBySelected)
            setIsPostedBySelected(true)
          } else if (focusedPostedByIdx === -1 && postedBy.length !== 0) {
            setShowPostedByDropdown(false)
          }
          break
        default:
          break
      }

      // Scroll into view logic
      const container = postedByRef.current
      const selectedItem = container?.children[
        focusedPostedByIdx
      ] as HTMLElement

      if (selectedItem && container) {
        const containerRect = container.getBoundingClientRect()
        const itemRect = selectedItem.getBoundingClientRect()

        // Check if the item is out of view and adjust the scroll position
        if (
          itemRect.bottom + selectedItem.offsetHeight >=
          containerRect.bottom
        ) {
          container.scrollTop +=
            itemRect.bottom -
            containerRect.bottom +
            selectedItem.offsetHeight +
            5
        } else if (
          itemRect.top <=
          containerRect.top + selectedItem.offsetHeight
        ) {
          container.scrollTop -=
            containerRect.top - itemRect.top + selectedItem.offsetHeight + 5
        }
      }
    },
    [
      dispatch,
      setFocusedPostedByIdx,
      router,
      setIsPostedBySelected,
      setShowPostedByDropdown,
      postedByDropdownList,
      postedByRef,
      focusedPostedByIdx,
      showPostedByDropdown,
      isPostedBySelected,
    ],
  )

  return handlePostedByKeyDown
}
