import {
  showAllTrue,
  toggleShowAllBlogs,
  toggleShowAllClasses,
  toggleShowAllEvent,
  toggleShowAllHobbies,
  toggleShowAllPeople,
  toggleShowAllPlace,
  toggleShowAllPosts,
  toggleShowAllProducts,
  toggleShowAllRentals,
  toggleShowAllUsers,
} from '@/redux/slices/search'
import { RootState } from '@/redux/store'
import { MenuItem, Select } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './../styles.module.css'
import hobbycue from '@/assets/svg/Search/hobbycue.svg'
import People from '@/assets/svg/Search/People.svg'
import UserSvg from '@/assets/svg/Search/User.svg'
import Hobby from '@/assets/svg/Search/Hobbies.svg'
import Place from '@/assets/svg/Search/Place.svg'
import Program from '@/assets/svg/Search/Program.svg'
import Product from '@/assets/svg/Search/Product.svg'
import Classes from '@/assets/svg/Search/classes.svg'
import Rentals from '@/assets/svg/Search/rentals.svg'
import Posts from '@/assets/svg/Search/Posts.svg'
import Blogs from '@/assets/svg/Search/blogs.svg'

type Props = {
  data?: any
  children?: any
  onChange?: any
}
const FilterDropdown: React.FC<Props> = () => {
  const router = useRouter()
  const { q, filter } = router.query
  const [activeFilter, setActiveFilter] = useState('all')
  const dispatch = useDispatch()
  const isExplore = useSelector((state: RootState) => state.search.explore)
  // const showAll = useSelector((state: any) => state.search.showAll)
  // const showAllUsers = useSelector((state: any) => state.search.showAllUsers)
  // const showAllhobbies = useSelector(
  //   (state: any) => state.search.showAllhobbies,
  // )
  // const showAllPeople = useSelector((state: any) => state.search.showAllPeople)
  // const showAllPlace = useSelector((state: any) => state.search.showAllPlace)
  // const showAllEvent = useSelector((state: any) => state.search.showAllEvent)
  // const showAllProducts = useSelector(!
  //   (state: any) => state.search.showAllProducts,
  // )
  // const showAllPosts = useSelector((state: any) => state.search.showAllPosts)
  // const showAllBlogs = useSelector((state: any) => state.search.showAllBlogs)

  const showAll = !filter || filter === 'all' || filter === ''
  const showAllUsers = filter === 'users'
  const showAllPeople = filter === 'people'
  const showAllPlace = filter === 'places'
  const showAllEvent = filter === 'programs'
  const showAllProducts = filter === 'products'
  const showAllPosts = filter === 'posts'
  const showAllBlogs = filter === 'blogs'
  const showAllHobbies = filter === 'hobby'

  useEffect(() => {
    if (showAll) {
      setActiveFilter('all')
    }
  }, [showAll])
  useEffect(() => {
    if (showAllUsers) {
      setActiveFilter('users')
    }
  }, [showAllUsers])
  useEffect(() => {
    if (showAllHobbies) {
      setActiveFilter('hobby')
    }
  }, [showAllHobbies])
  useEffect(() => {
    if (showAllPeople) {
      setActiveFilter('people')
    }
  }, [showAllPeople])
  useEffect(() => {
    if (showAllPlace) {
      setActiveFilter('places')
    }
  }, [showAllPlace])
  useEffect(() => {
    if (showAllEvent) {
      setActiveFilter('events')
    }
  }, [showAllEvent])
  useEffect(() => {
    if (showAllProducts) {
      setActiveFilter('products')
    }
  }, [showAllProducts])
  useEffect(() => {
    if (showAllPosts) {
      setActiveFilter('posts')
    }
  }, [showAllPosts])
  useEffect(() => {
    if (showAllBlogs) {
      setActiveFilter('blogs')
    }
  }, [showAllBlogs])

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

  useEffect(() => {
    if (!filter) {
      setActiveFilter('all')
      dispatch(showAllTrue())
    }
  }, [q, filter])

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
        case 'classes':
          dispatch(toggleShowAllClasses())
          break
        case 'rentals':
          dispatch(toggleShowAllRentals())
          break
        case 'posts':
          dispatch(toggleShowAllPosts())
          break
        case 'blogs':
          dispatch(toggleShowAllBlogs())
          break
        default:
          break
      }
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

  return (
    <Select
      disabled={isExplore}
      className={styles.filterDropdown}
      value={activeFilter}
    >
      <MenuItem
        onClick={() => handleFilterClick('all')}
        value="all"
        // style={{ display: 'flex', alignItems: 'center', gap: 16 }}
      >
        <div className={styles.responsiveMenuItem}>
          <Image src={hobbycue} alt="hobbycue" />
          <span>All of HobbyCue</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('users')} value="users">
        <div className={styles.responsiveMenuItem}>
          <Image src={UserSvg} alt="User" />
          <span>Users</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('hobby')} value="hobby">
        <div className={styles.responsiveMenuItem}>
          <Image src={Hobby} alt="hobby" />
          <span>Hobbies</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('people')} value="people">
        <div className={styles.responsiveMenuItem}>
          <Image src={People} alt="People" />
          <span>People Pages</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('places')} value="places">
        <div className={styles.responsiveMenuItem}>
          <Image src={Place} alt="Place" />
          <span>Places</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('events')} value="events">
        <div className={styles.responsiveMenuItem}>
          <Image src={Program} alt="Program" />
          <span>Programs</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('products')} value="products">
        <div className={styles.responsiveMenuItem}>
          <Image src={Product} alt="Product" />
          <span>Products</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('classes')} value="classes">
        <div className={styles.responsiveMenuItem}>
          <Image src={Classes} alt="Classes" />
          <span>Classes</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('rentals')} value="rentals">
        <div className={styles.responsiveMenuItem}>
          <Image src={Rentals} alt="Rentals" />
          <span>Rentals</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleFilterClick('posts')} value="posts">
        <div className={styles.responsiveMenuItem}>
          <Image src={Posts} alt="Post" />
          <span>Posts</span>
        </div>
      </MenuItem>

      <MenuItem onClick={() => handleFilterClick('blogs')} value="blogs">
        <div className={styles.responsiveMenuItem}>
          <Image src={Blogs} alt="Blogs" />
          <span>Blogs</span>
        </div>
      </MenuItem>
    </Select>
  )
}

export default FilterDropdown
