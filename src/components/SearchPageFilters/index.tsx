import React, { useState } from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import {
  toggleShowAll,
  toggleShowAllEvent,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllUsers,
} from '@/redux/slices/search'
import hobbycue from '../../assets/svg/Search/hobbycue.png'
import People from '../../assets/svg/Search/People.svg'
import User from '../../assets/svg/Search/User.svg'
import Place from '../../assets/svg/Search/Place.svg'
import Program from '../../assets/svg/Search/Program.svg'
import Product from '../../assets/svg/Search/Product.svg'
import styles from './styles.module.css'

const SearchPageFilter = () => {
  const dispatch = useDispatch()
  const [activeFilter, setActiveFilter] = useState('all')

  const handleFilterClick = (filterType: any) => {
    if (activeFilter === filterType) {
      setActiveFilter('') // Deselect if the same filter is clicked
      dispatch(toggleShowAll()) // Dispatch action to show all
    } else {
      setActiveFilter(filterType)
      switch (filterType) {
        case 'all':
          dispatch(toggleShowAll())
          break
        case 'users':
          dispatch(toggleShowAllUsers())
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
            className={getFilterItemClass('people')}
            onClick={() => handleFilterClick('people')}
          >
            <Image src={People} alt="People" />
            People Pages
          </div>
          <div
            className={getFilterItemClass('users')}
            onClick={() => handleFilterClick('users')}
          >
            <Image src={User} alt="User" />
            User Profiles
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

          <div className={styles['filter-item']}>
            <Image src={Product} alt="Product" />
            Products
          </div>
          {/* Add other filter items here */}
        </div>
      </div>
    </section>
  )
}

export default SearchPageFilter
