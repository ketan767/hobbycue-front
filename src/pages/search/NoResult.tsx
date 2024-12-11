import { useRouter } from 'next/router'
import styles from './styles.module.css'
import img204 from '@/assets/image/_204.png'
import Link from 'next/link'
import { isMobile } from '@/utils'
import SearchIcon from '@/assets/svg/search.svg'

import DownArrow from '@/assets/icons/DownArrow'
import Filter from './Filter'

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
    posts: 'Posts',
    classes: 'Classes',
    rentals: 'Rentals',
  }
  const isMob = isMobile()
  const { query } = router
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
          {/* <div className={styles.inputsContainer}>
            {filter === 'users' && (
              <div className={styles.hobbySuggestion}>
                <Image
                  src={SearchIcon}
                  width={16}
                  height={16}
                  alt="SearchIcon"
                  className={styles.searchIcon}
                />
                <TextField
                  autoComplete="off"
                  inputRef={nameInputRef}
                  variant="standard"
                  label="Name"
                  size="small"
                  name="name"
                  className={styles.hobbySearch}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key !== 'Enter') {
                      setShowNameDropdown(true)
                      setIsNameSelected(false)
                    }
                    handleNameKeyDown(e)
                  }}
                  value={currUserName}
                  onBlur={() =>
                    setTimeout(() => {
                      setShowNameDropdown(false)
                    }, 300)
                  }
                  onChange={(e) => {
                    setCurrUserName(e.target.value)
                    handleNameInputChange(e)
                  }}
                  sx={{
                    '& label': {
                      fontSize: '16px',
                      paddingLeft: '24px',
                    },
                    '& label.Mui-focused': {
                      fontSize: '14px',
                      marginLeft: '-16px',
                    },
                    '& .MuiInputLabel-shrink': {
                      marginTop: '3px',
                      fontSize: '14px',
                      marginLeft: '-16px',
                    },
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#7F63A1 !important',
                    },
                  }}
                  InputProps={{
                    sx: {
                      paddingLeft: '24px',
                    },
                  }}
                />
                {showNameDropdown && nameDropdownList?.length !== 0 && (
                  <div className={styles.dropdownHobby} ref={searchHobbyRef}>
                    {nameDropdownList?.map((name, index) => {
                      return (
                        <p
                          key={index}
                          onClick={() => {
                            dispatch(setUserName(name))
                          }}
                          className={
                            index === focusedNameIdx
                              ? styles['dropdown-option-focus']
                              : ''
                          }
                        >
                          {name}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {filter === 'posts' && (
              <div className={styles.hobbySuggestion}>
                <Image
                  src={SearchIcon}
                  width={16}
                  height={16}
                  alt="SearchIcon"
                  className={styles.searchIcon}
                />
                <TextField
                  autoComplete="off"
                  inputRef={postedByRef}
                  variant="standard"
                  label="Posted by"
                  size="small"
                  name="postedBy"
                  className={styles.hobbySearch}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      dispatch(setPostedBy(currPostedBy))
                    }
                    if (e.key === 'Enter') {
                      let query = {}
                      query = { ...query, filter: 'posts' }
                      if (currPostedBy) {
                        query = { ...query, postedBy: currPostedBy }
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
                    }
                  }}
                  value={currPostedBy}
                  onBlur={() =>
                    setTimeout(() => {
                      setShowHobbyDropdown(false)
                    }, 300)
                  }
                  onChange={(e) => {
                    setCurrPostedBy(e.target.value)
                  }}
                  sx={{
                    '& label': {
                      fontSize: '16px',
                      paddingLeft: '24px',
                    },
                    '& label.Mui-focused': {
                      fontSize: '14px',
                      marginLeft: '-16px',
                    },
                    '& .MuiInputLabel-shrink': {
                      marginTop: '3px',
                      fontSize: '14px',
                      marginLeft: '-16px',
                    },
                    '& .MuiInput-underline:hover:before': {
                      borderBottomColor: '#7F63A1 !important',
                    },
                  }}
                  InputProps={{
                    sx: {
                      paddingLeft: '24px',
                    },
                  }}
                />
              </div>
            )}

            <div className={styles.hobbySuggestion}>
              <Image
                src={SearchIcon}
                width={16}
                height={16}
                alt="SearchIcon"
                className={styles.searchIcon}
              />
              <TextField
                autoComplete="off"
                inputRef={searchHobbyRef}
                variant="standard"
                label="Hobby"
                size="small"
                name="hobby"
                className={styles.hobbySearch}
                onFocus={() => {
                  setShowHobbyDropdown(true)
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key !== 'Enter') {
                    setShowHobbyDropdown(true)
                    setIsHobbySelected(false)
                  }
                  handleHobbyKeyDown(e)
                  // handleSubmit(true)
                }}
                value={hobby}
                onBlur={() =>
                  setTimeout(() => {
                    setShowHobbyDropdown(false)
                  }, 300)
                }
                onChange={handleHobbyInputChange}
                sx={{
                  '& label': {
                    fontSize: '16px',
                    paddingLeft: '24px',
                  },
                  '& label.Mui-focused': {
                    fontSize: '14px',
                    marginLeft: '-16px',
                  },
                  '& .MuiInputLabel-shrink': {
                    marginTop: '3px',
                    fontSize: '14px',
                    marginLeft: '-16px',
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#7F63A1 !important',
                  },
                }}
                InputProps={{
                  sx: {
                    paddingLeft: '24px',
                  },
                }}
              />
              {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
                <div className={styles.dropdownHobby} ref={searchHobbyRef}>
                  {hobbyDropdownList.map((hobby, index) => {
                    return (
                      <p
                        key={hobby._id}
                        onClick={() => {
                          // setHobby(hobby.display)
                          // searchResult(undefined, hobby.display)
                          dispatch(setHobby(hobby.display))
                        }}
                        className={
                          index === focusedHobbyIndex
                            ? styles['dropdown-option-focus']
                            : ''
                        }
                      >
                        {hobby.display}
                      </p>
                    )
                  })}
                </div>
              )}
            </div>
            {filter !== 'users' && filter !== 'posts' && (
              <div className={styles.locationHiddenMobile}>
                <AccordionMenu2
                  categoryValue={categoryValue}
                  handleSubmit={handleSubmit}
                />
              </div>
            )}
            <div className={styles.categorySuggestion}>
              <Image
                src={SearchIcon}
                width={16}
                height={16}
                alt="SearchIcon"
                className={styles.searchIconCategory}
              />
              <TextField
                label="Location"
                autoComplete="off"
                inputRef={locationDropdownRef}
                variant="standard"
                name="street"
                size="small"
                className={styles.locationSearch}
                onChange={handleInputChangeAddress}
                value={currLocation}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  // handleLocationKeyDown(e)
                  // if (e.key === 'Enter') {
                  //   setShowAutoAddress(false)
                  // }
                  if (e.key !== 'Enter') {
                    setShowAutoAddress(true)
                    setIsLocationSelected(false)
                  }
                  handleLocationKeyDown(e)
                }}
                sx={{
                  '& .MuiInput-underline:hover:before': {
                    borderBottomColor: '#7F63A1 !important',
                  },
                  '& label': {
                    fontSize: '16px',
                    paddingLeft: '24px',
                  },
                  '& label.Mui-focused': {
                    fontSize: '14px',
                    marginLeft: '-16px',
                  },
                  '& .MuiInputLabel-shrink': {
                    marginTop: '3px',
                    fontSize: '14px',
                    marginLeft: '-16px',
                  },
                }}
                InputProps={{
                  sx: {
                    paddingLeft: '24px',
                  },
                }}
              />

              {showAutoAddress && (
                <div className={styles['dropdown']} ref={locationDropdownRef}>
                  {suggestions.map((suggestion, index) => (
                    <p
                      onClick={() => {
                        handleSelectAddressTwo(
                          suggestion.description.join(', '),
                          suggestion.place_id,
                        )
                        setLocation(suggestion.description[0])
                      }}
                      key={index}
                      className={
                        index === focusedLocationIdx
                          ? styles['dropdown-option-focus']
                          : ''
                      }
                    >
                      {suggestion.description.join(', ')}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {filter !== 'users' && filter !== 'posts' ? (
              <button
                className="modal-footer-btn"
                style={{
                  width: isMob ? '100%' : 71,
                  height: 32,
                  marginLeft: 'auto',
                }}
                onClick={() => handleSubmit()}
              >
                Explore
              </button>
            ) : (
              <button
                className="modal-footer-btn"
                style={{
                  width: isMob ? '100%' : 71,
                  height: 32,
                  marginLeft: 'auto',
                }}
                onClick={() => {
                  if (filter === 'users') {
                    handleUserProfileSearch()
                  } else if (filter === 'posts') {
                    handlePostsSearch()
                  }
                }}
              >
                Search
              </button>
            )}
          </div> */}
          <Filter />
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

const FilterInput = ({ placeholder = 'Hobby' }) => {
  return (
    <div className={styles.inputDiv}>
      <SearchIcon />
      <input autoComplete="new" type="text" placeholder={placeholder} />
      {placeholder === 'Category' && <DownArrow />}
      {/* DROPDOWN DIV */}
    </div>
  )
}
