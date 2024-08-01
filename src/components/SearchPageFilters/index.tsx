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

const SearchPageFilter = () => {
  const dispatch = useDispatch()
  const [activeFilter, setActiveFilter] = useState('all')
  const showAll = useSelector((state: any) => state.search.showAll)
  const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  const showAllhobbies = useSelector(
    (state: any) => state.search.showAllhobbies,
  )
  const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  const showAllProducts = useSelector(
    (state: any) => state.search.showAllProducts,
  )
  const showAllPosts = useSelector((state: any) => state.search.showAllPosts)
  const showAllBlogs = useSelector((state: any) => state.search.showAllBlogs)
  useEffect(() => {
    if (showAll === true) {
      setActiveFilter('all')
    } else if (showAllUsers === true) {
      setActiveFilter('users')
    } else if (showAllhobbies === true) {
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
    showAllhobbies,
    showAllBlogs,
    showAllPosts,
  ])

  const handleFilterClick = (filterType: any) => {
    if (activeFilter === filterType) {
      setActiveFilter('all')
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
        case 'events':
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
    }
  }

  const getFilterItemClass = (filterType: any) => {
    return `${styles['filter-item']} ${
      activeFilter === filterType ? styles['active-filter'] : ''
    }`
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
            onClick={() => handleFilterClick('hobby')}
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
            onClick={() => handleFilterClick('people')}
          >
            <Image src={People} alt="People" />
            People Pages
          </div>
          <div
            className={getFilterItemClass('places')}
            onClick={() => handleFilterClick('places')}
          >
            <Image src={Place} alt="Place" />
            Places
          </div>
          <div
            className={getFilterItemClass('events')}
            onClick={() => handleFilterClick('events')}
          >
            <Image src={Program} alt="Program" />
            Programs
          </div>

          <div
            className={getFilterItemClass('products')}
            onClick={() => handleFilterClick('products')}
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
            onClick={() => handleFilterClick('blogs')}
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
