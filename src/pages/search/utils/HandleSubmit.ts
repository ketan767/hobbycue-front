import { setCategory, setPageType } from '@/redux/slices/explore'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'

// Custom hooks for typed usage of Redux hooks
const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

const useGetLink = () => {
  const {
    keyword,
    hobby,
    category,
    page_type,
    location: currLocation,
  } = useTypedSelector((state) => state.explore)
  const dispatch = useDispatch()

  const getLink = (): string => {
    let link = '/explore'
    if (page_type) {
      switch (page_type.toLowerCase()) {
        case 'place':
          link += '/places?'
          break
        case 'people':
          link += '/people?'
          break
        case 'program':
          link += '/programs?'
          break
        case 'product':
          link += '/products?'
          break
      }
      link += `page-type=${page_type}`
    } else if (category) {
      const formattedCategory =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()

      if (
        formattedCategory === 'People' ||
        formattedCategory === 'Place' ||
        formattedCategory === 'Program' ||
        formattedCategory === 'Product'
      ) {
        link += `?page-type=${formattedCategory}`
        dispatch(setCategory(''))
        dispatch(setPageType(formattedCategory))
      } else {
        link += `?category=${formattedCategory}`
        dispatch(setCategory(formattedCategory))
        dispatch(setPageType(''))
      }
    }

    if (hobby) {
      link += link.includes('?') ? '&' : '?'
      link += `hobby=${hobby}`
    }

    if (currLocation) {
      link += link.includes('?') ? '&' : '?'
      link += `location=${currLocation}`
    }

    if (keyword) {
      link += link.includes('?') ? '&' : '?'
      link += `keyword=${keyword}`
    }

    return link
  }

  return getLink
}
const useGetLink2 = () => {
  const {
    keyword,
    hobby,
    category,
    page_type,
    location: currLocation,
  } = useTypedSelector((state) => state.explore)
  const dispatch = useDispatch()

  const getLink = (
    selectedCategory: string,
    selectedPageType: string,
    selectedHobby: string,
    selectedLocation: string,
  ): string => {
    console.log('selectedPageType', selectedPageType)
    let link = '/explore'
    if (selectedPageType) {
      switch (selectedPageType.toLowerCase()) {
        case 'place':
          link += '/places?'
          break
        case 'people':
          link += '/people?'
          break
        case 'program':
          link += '/programs?'
          break
        case 'product':
          link += '/products?'
          break
      }
      link += `page-type=${selectedPageType}`
      dispatch(setCategory(''))
      dispatch(setPageType(selectedPageType))
    } else if (selectedCategory) {
      const formattedCategory =
        selectedCategory.charAt(0).toUpperCase() +
        selectedCategory.slice(1).toLowerCase()
      if (
        formattedCategory === 'People' ||
        formattedCategory === 'Place' ||
        formattedCategory === 'Program' ||
        formattedCategory === 'Product'
      ) {
        link += `?page-type=${formattedCategory}`
        dispatch(setCategory(''))
        dispatch(setPageType(formattedCategory))
      } else {
        link += `?category=${formattedCategory}`
        dispatch(setCategory(formattedCategory))
        dispatch(setPageType(''))
      }
    }

    if (selectedHobby) {
      link += link.includes('?') ? '&' : '?'
      link += `hobby=${selectedHobby}`
    } else if (hobby) {
      link += link.includes('?') ? '&' : '?'
      link += `hobby=${hobby}`
    }

    if (selectedLocation) {
      link += link.includes('?') ? '&' : '?'
      link += `location=${selectedLocation}`
    } else if (currLocation) {
      link += link.includes('?') ? '&' : '?'
      link += `location=${currLocation}`
    }

    if (keyword) {
      link += link.includes('?') ? '&' : '?'
      link += `keyword=${keyword}`
    }

    return link
  }

  return getLink
}

export default function useHandleSubmit() {
  const router = useRouter()
  const getLink = useGetLink()
  const getLink2 = useGetLink2()

  const handleSubmit = (
    selectedCategory?: string,
    selectedPageType?: string,
    selectedHobby?: string,
    selectedLocation?: string,
  ) => {
    let link = ''
    console.log('selectedCategory', selectedCategory)
    console.log('selectedPageType', selectedPageType)
    if (selectedCategory || selectedPageType || selectedHobby ||selectedLocation) {
      link = getLink2(
        selectedCategory!,
        selectedPageType!,
        selectedHobby!,
        selectedLocation!,
      )
    } else {
      link = getLink()
    }
    router.push(link)
  }

  return handleSubmit
}
