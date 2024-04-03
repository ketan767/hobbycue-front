import React, { useEffect, useState } from 'react'
import styles from '@/styles/AllHobbies.module.css'
import { getAllHobbies } from '@/services/hobby.service'
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from '@mui/material'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { isEmptyField } from '@/utils'
import Image from 'next/image'
import AddIcon from '@/assets/svg/add-circle.svg'
import { useRouter } from 'next/router'

type Props = {
  data: any
}

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
}

type ListingHobbyData = {
  hobby: DropdownListItem | null
}

type HobbyType = {
  _id: string
  display: string
  slug: any
  category: {
    _id: string
    display: string
  }
  sub_category?: {
    _id: string
    display: string
  }
}

const ALlHobbies: React.FC<Props> = ({ data }) => {
  console.warn({data});
  
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [hobbyData, setHobbyData] = useState<HobbyType[]>([])

  const [filtercategories, setFilterCategories] = useState([])
  const [filtersubCategories, setFilterSubCategories] = useState([])
  const [filterhobbyData, setFilterHobbyData] = useState([])
  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [dataa, setData] = useState<ListingHobbyData>({ hobby: null })
  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)

  const [filterData, setFilterData] = useState({
    category: '',
    subCategory: '',
    hobby: '',
  })
  // const { isLoggedIn, isAuthenticated, user } = useSelector(
  //   (state: RootState) => state.user,
  // )
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)
    if (e.target.value === '') {
      setFilterData((prev) => ({ ...prev, hobby: '' }))
    }
    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])

    let filteredHobbies = [...data.hobbies,...data.genre.map((obj:any)=>({...obj?.genre[0],category:obj?.category,sub_category:obj?.sub_category}))];
    const normalizedSearchTerm = e.target.value.toLowerCase()

    if (filterData.category) {
      filteredHobbies = filteredHobbies.filter(
        (hobby: any) => hobby?.category?._id === filterData.category,
      )
    }

    if (filterData.subCategory) {
      filteredHobbies = filteredHobbies.filter(
        (hobby: any) => hobby?.sub_category?._id === filterData.subCategory,
      )
    }
    if (e.target.value) {
      filteredHobbies = filteredHobbies.filter((hobby: any) =>
        hobby?.display?.toLowerCase()?.includes(normalizedSearchTerm),
      )
    }

    filteredHobbies = filteredHobbies.sort((a: any, b: any) => {
      const aIndex = a?.display?.toLowerCase()?.indexOf(normalizedSearchTerm)
      const bIndex = b?.display?.toLowerCase()?.indexOf(normalizedSearchTerm)
      return aIndex - bIndex
    })
    // return filteredHobbies;
    setData((prev) => {
      return { ...prev, hobby: null }
    })

    setHobbyDropdownList(filteredHobbies)

    // const query = `fields=display,sub_category&show=true&search=${e.target.value}`
    // const { err, res } = await getAllHobbies(query)
    // if (err) return console.log(err)
    // setHobbyDropdownList(res.data.hobbies)
  }
  const params = new URLSearchParams()
  const handleFilter = async () => {
    setCategories(data.categories)
    if (filterData.category === '' && filterData.subCategory === '')
      resetHobbiesData()
    if (filterData.category !== '') {
      params.set('_id', filterData.category)
      const { err, res } = await getAllHobbies(`level=0&${params.toString()}`)
      if (err) return console.log(err)
      setCategories(res.data.hobbies)
    }
    if (filterData.subCategory !== '') {
      params.set('_id', filterData.subCategory)

      const { err, res } = await getAllHobbies(
        `level=1&${params.toString()}&populate=category,sub_category,tags`,
      )
      if (err) return console.log(err)
      setSubCategories(res.data.hobbies)
    }
    if (filterData.hobby !== '') {
      params.set('_id', filterData.hobby)
      const { err, res } = await getAllHobbies(`level=2&${params.toString()}`)
      if (err) return console.log(err)
      setHobbyData(res.data.hobbies)
    }
  }

  const resetHobbiesData = async () => {
    // resetHobbiesData()
    setCategories(data.categories)
    setFilterCategories(data.categories)
    setSubCategories(data.sub_categories)
    setFilterSubCategories(data.sub_categories)
    setHobbyData([...data.hobbies,...data.genre.map((obj:any)=>({...obj?.genre[0],category:obj?.category,sub_category:obj?.sub_category}))])
  }

  useEffect(() => {
    // resetHobbiesData()
    setCategories(data.categories)
    setFilterCategories(data.categories)
    setSubCategories(data.sub_categories)
    setFilterSubCategories(data.sub_categories)
    setHobbyData([...data.hobbies,...data.genre.map((obj:any)=>({...obj?.genre[0],category:obj?.category,sub_category:obj?.sub_category}))])
  }, [])

  const router = useRouter()
  
  useEffect(() => {
    // Save scroll position when navigating away from the page
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionhobby', window.scrollY.toString())
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionhobby')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        sessionStorage.removeItem('scrollPositionhobby')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    router.events.on('routeChangeComplete', handleScrollRestoration)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleScrollRestoration)
    }
  }, [])

  useEffect(() => {
    let tempSubCategories = data.sub_categories.filter(
      (item: any) => item.category._id === filterData.category,
    )
    setFilterSubCategories(tempSubCategories)
  }, [filterData.category])

  const isMobile = useMediaQuery('(max-width:1100px)')

  console.log({categories,subCategories,hobbyData});

  return (
    <div className={styles['all-hobby-wrapper']}>
      <div className={`site-container ${styles['page-container']}`}>
        {!isMobile && (
          <aside className={styles['hobby-filter']}>
            {/* Filters */}

            <div className={styles['filter-wrapper']}>
              <h2>Hobbies</h2>
              <header>
                <h4 className={styles['heading']}>Filter</h4>
                {/* <button onClick={handleFilter}>Apply</button> */}
              </header>

              <div className={styles['select-filter']}>
                <p>Category</p>
                <FormControl variant="outlined" fullWidth size="small">
                  <Select
                    value={filterData.category}
                    onChange={(e) =>
                      setFilterData((prev) => {
                        if(e.target.value!==prev.category){
                          setHobbyInputValue('');
                          return {
                            category: e.target.value,
                            subCategory: '',
                            hobby:''
                          }
                        }
                        if (e.target.value === '') {
                          return {
                            ...prev,
                            category: e.target.value,
                            subCategory: '',
                          }
                        }
                        return { ...prev, category: e.target.value }
                      })
                    }
                    displayEmpty
                    // inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {filtercategories.map((cat: any, idx) => {
                      return (
                        <MenuItem key={idx} value={cat._id}>
                          {cat.display}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className={styles['select-filter']}>
                <p>Sub-Category</p>
                <FormControl variant="outlined" fullWidth size="small">
                  <Select
                    value={filterData.subCategory}
                    onChange={(e) =>
                      setFilterData((prev) => {
                        if(e.target.value!==prev.subCategory){
                          setHobbyInputValue('');
                          return { ...prev, subCategory: e.target.value, hobby:'' }
                        }
                        return { ...prev, subCategory: e.target.value }
                      })
                    }
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value="">All Sub-Categories</MenuItem>
                    {filtersubCategories.map((cat: any, idx) => {
                      return (
                        <MenuItem key={idx} value={cat._id}>
                          {cat.display}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className={styles['select-filter']}>
                <p>Hobby</p>
                <TextField
                  size="small"
                  placeholder="Text here with any keyword"
                  id="outlined-basic"
                  variant="outlined"
                  value={hobbyInputValue}
                  onFocus={() => setShowHobbyDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => {
                      setShowHobbyDropdown(false)
                    }, 300)
                  }
                  onChange={handleHobbyInputChange}
                />
              </div>
              {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
                <div className={styles['dropdown']}>
                  {hobbyDropdownList.map((hobby) => {
                    return (
                      <p
                        key={hobby._id}
                        onClick={() => {
                          setData((prev) => {
                            return { ...prev, hobby: hobby }
                          })
                          setHobbyInputValue(hobby.display)
                          setFilterData((prev) => ({
                            ...prev,
                            hobby: hobby._id,
                          }))
                        }}
                      >
                        {hobby.display}
                      </p>
                    )
                  })}
                </div>
              )}
            </div>
          </aside>
        )}

        <main>
          <div className={styles['hobby-desc-container']}>
            <h1 className={styles['heading']}>Hobbies</h1>
            <div className={styles['text']}>
              <p>
                Here is a reference list of hobbies categorised primarily based
                on the research work of Dr. Robert Stebbins called Serious
                Leisure. Dr. Stebbins defines Series Leisure as a systematic
                pursuit of an amateur, hobbyist or volunteer that is
                substantial, rewarding and results in a sense of accomplishment.
                Here is a top-down view of the categorisation.
              </p>
              <p>
                While we maintain the same 5 top-level categories for a
                Hobbyist, the sub-categories may be slightly different. Each
                Category or Sub-Category has a dedicated page – just click on
                the name to navigate. Search on this page for any hobby and let
                us know if we’re missing something.
              </p>
            </div>
          </div>
          {isMobile && (
            <aside className={styles['hobby-filter']}>
              {/* Filters */}

              <div className={styles['filter-wrapper']}>
                <header>
                  <h4 className={styles['heading']}>Filter</h4>
                  {/* <button onClick={handleFilter}>Apply</button> */}
                </header>

                <div className={styles['select-filter']}>
                  <p>Category</p>
                  <FormControl variant="outlined" fullWidth size="small">
                    <Select
                      value={filterData.category}
                      onChange={(e) =>
                        setFilterData((prev) => {
                          if(e.target.value!==prev.category){
                            setHobbyInputValue('');
                            return {
                              category: e.target.value,
                              subCategory: '',
                              hobby:''
                            }
                          }
                          if (e.target.value === '') {
                            return {
                              category: e.target.value,
                              subCategory: '',
                              hobby:''
                            }
                          }
                          return { ...prev, category: e.target.value }
                        })
                      }
                      displayEmpty
                      // inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {filtercategories.map((cat: any, idx) => {
                        return (
                          <MenuItem key={idx} value={cat._id}>
                            {cat.display}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className={styles['select-filter']}>
                  <p>Sub-Category</p>
                  <FormControl variant="outlined" fullWidth size="small">
                    <Select
                      value={filterData.subCategory}
                      onChange={(e) =>
                        setFilterData((prev) => {
                          if(e.target.value!==prev.subCategory){
                            setHobbyInputValue('');
                            return { ...prev, subCategory: e.target.value, hobby:'' }
                          }
                          return { ...prev, subCategory: e.target.value }
                        })
                      }
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value="">All Sub-Categories</MenuItem>
                      {filtersubCategories.map((cat: any, idx) => {
                        return (
                          <MenuItem key={idx} value={cat._id}>
                            {cat.display}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className={styles['select-filter']}>
                  <p>Hobby</p>
                  <TextField
                    size="small"
                    placeholder="Text here with any keyword"
                    id="outlined-basic"
                    variant="outlined"
                    value={hobbyInputValue}
                    className={styles['hobby-text-input']}
                    onFocus={() => setShowHobbyDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => {
                        setShowHobbyDropdown(false)
                      }, 300)
                    }
                    onChange={handleHobbyInputChange}
                  />
                </div>
                {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
                  <div className={styles['dropdown']}>
                    {hobbyDropdownList.map((hobby) => {
                      return (
                        <p
                          key={hobby._id}
                          onClick={() => {
                            setData((prev) => {
                              return { ...prev, hobby: hobby }
                            })
                            setHobbyInputValue(hobby.display)
                            setFilterData((prev) => ({
                              ...prev,
                              hobby: hobby._id,
                            }))
                          }}
                        >
                          {hobby.display}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>
            </aside>
          )}
          {categories.length > 0 && (
            <div className={styles['table-container']}>
              <table className={styles['hobbies-table']}>
                <div className={styles['thead-container']}>
                  <thead>
                    <tr className="">
                      <th>Category</th>
                      <th>Sub-Category</th>
                      <th>Hobby</th>
                    </tr>
                  </thead>
                </div>
                <tbody>
                  {categories
                    .filter((cat: any) => {
                      if (filterData.hobby) {
                        return (
                          cat._id ===
                          hobbyData.find((h) => h._id === filterData.hobby)
                            ?.category?._id
                        )
                      } else if (!filterData.category) {
                        return true // No filtering if filterData.category is empty
                      } else {
                        return cat._id === filterData.category
                      }
                    })
                    .sort((a: any, b: any) =>
                      a.display.localeCompare(b.display),
                    )
                    .map((cat: any, i) => (
                      <tr key={i}>
                        <td className="">
                          <Link href={`/hobby/${cat.slug}`}>{cat.display}</Link>
                        </td>
                        <td>
                          {subCategories
                            .filter((subCat: any) => {
                              if (filterData.hobby) {
                                return (
                                  subCat._id ===
                                  hobbyData.find(
                                    (h) => h._id === filterData.hobby,
                                  )?.sub_category?._id
                                )
                              } else if (!filterData.subCategory) {
                                return true // No filtering if filterData.subCategory is empty
                              } else {
                                return (
                                  subCat._id === filterData.subCategory
                                  // !filterData.hobby ||
                                )
                              }
                            })
                            .sort((a: any, b: any) =>
                              a.display.localeCompare(b.display),
                            )
                            .map((subCat: any) => {
                              return (
                                subCat.category?._id === cat._id && (
                                  <div
                                    className={
                                      styles['table-content-container']
                                    }
                                  >
                                    <p>
                                      <Image src={AddIcon} alt="add" />{' '}
                                      <Link href={`/hobby/${subCat.slug}`}>
                                        {subCat.display}
                                      </Link>
                                    </p>
                                    <div
                                      className={styles['vertical-line']}
                                    ></div>
                                    <p className={styles['table-hobby']}>
                                      {hobbyData
                                        .filter(
                                          (hobby: HobbyType) =>
                                            hobby.category?._id === cat._id &&
                                            hobby.sub_category?._id ===
                                              subCat._id,
                                        )
                                        .sort((a, b) =>
                                          a.display.localeCompare(b.display),
                                        )
                                        .map((hobby: HobbyType) => (
                                          <Link
                                            key={hobby.slug}
                                            href={`/hobby/${hobby.slug}`}
                                            className={`${filterData.hobby===hobby?._id&&styles['searched-hobby-id']}`}
                                          >
                                            <span>{hobby.display}, </span>
                                          </Link>
                                        ))}
                                    </p>
                                  </div>
                                )
                              )
                            })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ALlHobbies

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const category = await getAllHobbies(`level=0`)
  const subCategory = await getAllHobbies(
    `level=1&populate=category,sub_category,tags`,
  )
  const hobby = await getAllHobbies(
    `level=3&populate=category,sub_category,tags&limit=500`,
  )

  const l2hobbies = await getAllHobbies(`level=2&populate=category,sub_category,tags`);
  // const l4hobbies = await getAllHobbies(`level=4&populate=category,sub_category,tags`);
  const l5hobbies = await getAllHobbies(`level=5&populate=genre`);

  return {
    props: {
      data: {
        categories: category.res?.data.hobbies,
        sub_categories: subCategory.res?.data.hobbies,
        hobbies: hobby.res?.data.hobbies,
        l2hobbies:l2hobbies.res?.data?.hobbies,
        // l4hobbies:l4hobbies.res?.data,
        genre:l5hobbies.res?.data?.hobbies
      },
    },
  }
}
