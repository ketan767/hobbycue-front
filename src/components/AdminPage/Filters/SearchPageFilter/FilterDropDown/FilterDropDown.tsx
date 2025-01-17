import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import hobbycue from '../../../../../assets/svg/Search/hobbycue.svg'
import People from '../../../../../assets/svg/Search/People.svg'
import User from '../../../../../assets/svg/Search/User.svg'
import Hobby from '../../../../../assets/svg/Search/Hobbies.svg'
import Place from '../../../../../assets/svg/Search/Place.svg'
import Program from '../../../../../assets/svg/Search/Program.svg'
import Product from '../../../../../assets/svg/Search/Product.svg'
import Blogs from '../../../../../assets/svg/Search/blogs.svg'
import Posts from '../../../../../assets/svg/Search/Posts.svg'
import Classes from '../../../../../assets/svg/Search/classes.svg'
import Rentals from '../../../../../assets/svg/Search/rentals.svg'
import styles from './FilterDropDown.module.css'
import { useSearchPageContext } from '@/pages/admin/searches'
const filters = [
  { key: 'all', label: 'All of HobbyCue', icon: hobbycue },
  { key: 'hobby', label: 'Hobbies', icon: Hobby },
  { key: 'users', label: 'User Profiles', icon: User },
  { key: 'people', label: 'People Pages', icon: People },
  { key: 'places', label: 'Places', icon: Place },
  { key: 'events', label: 'Programs', icon: Program },
  { key: 'products', label: 'Products', icon: Product },
  { key: 'classes', label: 'Classes', icon: Classes },
  { key: 'rentals', label: 'Rentals', icon: Rentals },
  { key: 'posts', label: 'Posts', icon: Posts },
  { key: 'blogs', label: 'Blogs', icon: Blogs },
]
const FilterDropdown = () => {
  const { setFilterState } = useSearchPageContext()

  const [isOpen, setIsOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<String>('')

  const handleFilterClick = (filterType: String) => {
    if (activeFilter === filterType) return
    setActiveFilter(filterType)
    setFilterState((pre) => {
      return { ...pre, filterValue: filterType }
    })
    setIsOpen(false)
  }

  return (
    <section className={` ${styles['hobbies-side-wrapper']}`}>
      <div>
        <h2 className={styles['filter-sidebar']}>Filters</h2>
        <div className={styles['filters-container']}>
          {/* Dropdown Toggle */}
          <div
            className={`${styles['filters-container']} ${styles['filter-item']}`}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {filters.find((filter) => filter.key === activeFilter)?.label ||
              'Select an option'}
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className={styles['dropdown-menu']}>
              {filters.map(({ key, label, icon }) => (
                <div
                  key={key}
                  className={`${styles['filter-item']} ${
                    activeFilter === key ? styles['active-filter'] : ''
                  }`}
                  onClick={() => handleFilterClick(key)}
                >
                  <Image src={icon} alt={label} width={20} height={20} />
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FilterDropdown
