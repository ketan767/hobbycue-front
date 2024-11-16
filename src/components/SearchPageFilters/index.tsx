import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
  showAllTrue,
  toggleShowAllBlogs,
  // toggleShowAll,
  toggleShowAllEvent,
  toggleShowAllHobbies,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllPosts,
  toggleShowAllProducts,
  toggleShowAllUsers,
} from '@/redux/slices/search'
import hobbycue from '../../assets/svg/Search/hobbycue.svg'
import People from '../../assets/svg/Search/People.svg'
import User from '../../assets/svg/Search/User.svg'
import Hobby from '../../assets/svg/Search/Hobbies.svg'
import Place from '../../assets/svg/Search/Place.svg'
import Program from '../../assets/svg/Search/Program.svg'
import Product from '../../assets/svg/Search/Product.svg'
import Blogs from '../../assets/svg/Search/blogs.svg'
import Posts from '../../assets/svg/Search/Posts.svg'
import styles from './styles.module.css'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { setCategory } from '@/redux/slices/explore'

const SearchPageFilter = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { q, filter } = router.query
  const isExplore = useSelector((state: RootState) => state.search.explore)
  const [activeFilter, setActiveFilter] = useState('all')
  // const showAll = useSelector((state: any) => state.search.showAll)
  // const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  // const showAllHobbies = useSelector(
  //   (state: any) => state.search.showAllHobbies,
  // )
  // const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  // const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  // const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  // const showAllProducts = useSelector(
  //   (state: any) => state.search.showAllProducts,
  // )
  // const showAllPosts = useSelector((state: any) => state.search.showAllPosts)
  // const showAllBlogs = useSelector((state: any) => state.search.showAllBlogs)

  const showAll = filter === 'all'
  const showAllUsers = filter === 'users'
  const showAllPeople = filter === 'people'
  const showAllPlace = filter === 'places'
  const showAllEvent = filter === 'programs'
  const showAllProducts = filter === 'products'
  const showAllPosts = filter === 'posts'
  const showAllBlogs = filter === 'blogs'
  const showAllHobbies = filter === 'hobby'

  const userSearchResults = useSelector(
    (state: RootState) => state.search.userSearchResults.data,
  )
  const PeopleSearch = useSelector(
    (state: RootState) => state.search.typeResultOne.data,
  )
  const PlaceSearch = useSelector(
    (state: RootState) => state.search.typeResultTwo.data,
  )
  const EventSearch = useSelector(
    (state: RootState) => state.search.typeResultThree.data,
  )
  const ProductSearch = useSelector(
    (state: RootState) => state.search.typeResultFour.data,
  )
  const PostsSearch = useSelector(
    (state: RootState) => state.search.postsSearchResults.data,
  )
  const BlogsSearch = useSelector(
    (state: RootState) => state.search.blogsSearchResults.data,
  )
  const searchLoading = useSelector((state: RootState) => state.search.loading)
  const hobbySearchResults = useSelector(
    (state: RootState) => state.search.hobbiesSearchResults.data,
  )

  const noResultsFound =
    userSearchResults.length === 0 &&
    hobbySearchResults.length === 0 &&
    PeopleSearch.length === 0 &&
    PlaceSearch.length === 0 &&
    EventSearch.length === 0 &&
    ProductSearch.length === 0 &&
    PostsSearch.length === 0 &&
    BlogsSearch.length === 0

  useEffect(() => {
    if (showAll === true) {
      setActiveFilter('all')
    } else if (showAllUsers === true) {
      setActiveFilter('users')
    } else if (showAllHobbies === true) {
      setActiveFilter('hobby')
    } else if (showAllPeople === true) {
      setActiveFilter('people')
    } else if (showAllPlace === true) {
      setActiveFilter('places')
    } else if (showAllEvent === true) {
      setActiveFilter('events')
    } else if (showAllProducts === true) {
      setActiveFilter('products')
    } else if (showAllBlogs === true) {
      setActiveFilter('blogs')
    } else if (showAllPosts === true) {
      setActiveFilter('posts')
    }
  }, [
    showAll,
    showAllEvent,
    showAllPeople,
    showAllPlace,
    showAllProducts,
    showAllUsers,
    showAllHobbies,
    showAllBlogs,
    showAllPosts,
  ])

  const handleFilterClick = (filterType: any) => {
    if (isExplore) return
    if (activeFilter === filterType) {
      setActiveFilter('all')
      router.push({
        pathname: '/search',
        query: { ...router.query, filter: '' },
      })
      dispatch(showAllTrue())
    } else {
      setActiveFilter(filterType)
      switch (filterType) {
        case 'all':
          dispatch(showAllTrue())
          break
        case 'users':
          dispatch(toggleShowAllUsers())
          break
        case 'hobby':
          dispatch(toggleShowAllHobbies())
          break
        case 'people':
          dispatch(toggleShowAllPeople())
          break
        case 'places':
          dispatch(toggleShowAllPlace())
          break
        case 'programs':
          dispatch(toggleShowAllEvent())
          break
        case 'products':
          dispatch(toggleShowAllProducts())
          break
        case 'blogs':
          dispatch(toggleShowAllBlogs())
          break
        case 'posts':
          dispatch(toggleShowAllPosts())
          break
        default:
          break
      }
      if (filterType === 'all') {
        const { filter, ...rest } = router.query
        router.push({
          pathname: '/search',
          query: {
            ...rest,
          },
        })
      } else {
        router.push({
          pathname: '/search',
          query: {
            ...router.query,
            filter: filterType,
          },
        })
      }
    }
  }

  const getFilterItemClass = (filterType: any) => {
    return `${styles['filter-item']} ${
      activeFilter === filterType ? styles['active-filter'] : ''
    } ${isExplore && styles['filter-item-disabled']}`
  }

  return (
    <section
      className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
    >
      <header>
        <div className={styles['heading']}>
          <h1>Search Results</h1>
        </div>
      </header>
      <div>
        <h2 className={styles['filter-sidebar']}>Filters</h2>
        <div className={styles['filters-container']}>
          <div
            className={getFilterItemClass('all')}
            onClick={() => handleFilterClick('all')}
          >
            <Image src={hobbycue} alt="hobbycue" />
            All of HobbyCue
          </div>
          <div
            className={getFilterItemClass('hobby')}
            onClick={() => {
              // console.log(
              //   'No result found-------------------------------->',
              //   noResultsFound,
              // )
              if (noResultsFound || hobbySearchResults.length === 0) {
                router.push('/hobbies')
              } else {
                handleFilterClick('hobby')
              }
            }}
          >
            <Image src={Hobby} alt="hobby" />
            Hobbies
          </div>
          <div
            className={getFilterItemClass('users')}
            onClick={() => handleFilterClick('users')}
          >
            <Image src={User} alt="User" />
            User Profiles
          </div>

          <div
            className={getFilterItemClass('people')}
            onClick={() => {
              dispatch(setCategory('People'))
              handleFilterClick('people')
            }}
          >
            <Image src={People} alt="People" />
            People Pages
          </div>
          <div
            className={getFilterItemClass('places')}
            onClick={() => {
              dispatch(setCategory('Place'))
              handleFilterClick('places')
            }}
          >
            <Image src={Place} alt="Place" />
            Places
          </div>
          <div
            className={getFilterItemClass('events')}
            onClick={() => {
              dispatch(setCategory('Program'))
              handleFilterClick('programs')
            }}
          >
            <Image src={Program} alt="Program" />
            Programs
          </div>

          <div
            className={getFilterItemClass('products')}
            onClick={() => {
              dispatch(setCategory('Product'))

              handleFilterClick('products')
            }}
          >
            <Image src={Product} alt="Product" />
            Products
          </div>
          <div
            className={getFilterItemClass('posts')}
            onClick={() => handleFilterClick('posts')}
          >
            <Image src={Posts} alt="Posts" />
            Posts
          </div>
          <div
            className={getFilterItemClass('blogs')}
            onClick={() => {
              if (noResultsFound || BlogsSearch.length === 0) {
                router.push('/blogs')
              } else {
                handleFilterClick('blogs')
              }
            }}
          >
            <Image src={Blogs} alt="Blogs" />
            Blogs
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchPageFilter
