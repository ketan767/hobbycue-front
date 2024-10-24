import { useRouter } from 'next/router'
import styles from './styles.module.css'
import img204 from '@/assets/image/_204.png'
import Link from 'next/link'
import { isMobile } from '@/utils'
import SearchIcon from '@/assets/icons/SearchIcon'
import { useState } from 'react'
import DownArrow from '@/assets/icons/DownArrow'

const NoResult = () => {
  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const filterMap: { [key: string]: string } = {
    hobby: 'Hobbies',
    users: 'User Profiles',
    people: 'People Pages',
    places: 'Places',
    programs: 'Programs',
    products: 'Products',
    blogs: 'Blogs',
  }
  const isMob = isMobile()

  return (
    <div className={styles['no-results-wrapper']}>
      {q !== '' && (
        <div className={styles.imageDiv}>
          <img src={img204.src} alt="No Result Found" />
        </div>
      )}

      <div className={styles.main}>
        {q !== '' ? (
          <h1>
            Mm-hmm... No results for "{q}"{' '}
            {filter ? `under ${filterMap[filter.toString()]}` : ``}
          </h1>
        ) : (
          <h1>
            {' '}
            Use the <strong> Search box</strong> at the top to look for anything
            on your hobbies.
          </h1>
        )}

        {q !== '' ? (
          <p>
            Please check for spelling errors or try a shorter search string.
            {!isMob ? <br /> : ' '}
            Alternately, you can Explore <span>Pages</span> using the below.
          </p>
        ) : (
          <p>Alternately, you can Explore Pages using the below.</p>
        )}
        <div className={styles.filterParent}>
          <div className={styles.filter}>
            <div className="">
              <FilterInput placeholder="Hobby" />
              <FilterInput placeholder="Category" />
            </div>
            <div className="">
              <FilterInput placeholder="Location" />
              <Link href="/explore">
                <button
                  className="modal-footer-btn"
                  style={{ width: 71, height: 32 }}
                >
                  Explore
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrapperFooter}>
        <p>Do you feel we are missing a listing ?</p>
        <button>
          <Link href="/add-listing">Add New</Link>
        </button>
      </div>
    </div>
  )
}

export default NoResult

const FilterInput = ({
  placeholder = 'Hobby',
  //   value,
  // handleChange,
  // isFocused,
  // handleFocus,
  // showDropdown,
  // setShowDropdown,
}) => {
  return (
    <div className={styles.inputDiv}>
      <SearchIcon />
      <input
        type="text"
        placeholder={placeholder}
        // value={value} onChange={handleChange} onFocus={handleFocus}
      />
      {placeholder === 'Category' && <DownArrow />}
      {/* DROPDOWN DIV */}
    </div>
  )
}
