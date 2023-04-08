import React, { useEffect, useState } from 'react'
import styles from '@/styles/AllHobbies.module.css'
import { getAllHobbies } from '@/services/hobbyService'
import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import Link from 'next/link'

type Props = {}

const ALlHobbies: React.FC<Props> = (props) => {
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [hobbyData, setHobbyData] = useState([])
  const [filtercategories, setFilterCategories] = useState([])
  const [filtersubCategories, setFilterSubCategories] = useState([])
  const [filterhobbyData, setFilterHobbyData] = useState([])

  const [filterData, setFilterData] = useState({
    category: '',
    subCategory: '',
    hobby: '',
  })

  const params = new URLSearchParams()
  const handleFilter = () => {
    if (filterData.category === '' && filterData.subCategory === '') resetHobbiesData()
    if (filterData.category !== '') {
      params.set('_id', filterData.category)
      getAllHobbies(`level=0&${params.toString()}`, (err, res) => {
        if (err) return console.log(err)
        setCategories(res.data.hobbies)
      })
    }
    if (filterData.subCategory !== '') {
      params.set('_id', filterData.subCategory)
      getAllHobbies(
        `level=1&${params.toString()}&populate=category,sub_category,tags`,
        (err, res) => {
          if (err) return console.log(err)
          setSubCategories(res.data.hobbies)
        },
      )
    }
  }

  const resetHobbiesData = () => {
    getAllHobbies(`level=0`, (err, res) => {
      if (err) return console.log(err)
      setCategories(res.data.hobbies)
      setFilterCategories(res.data.hobbies)
    })
    getAllHobbies(`level=1&populate=category,sub_category,tags`, (err, res) => {
      if (err) return console.log(err)
      setFilterSubCategories(res.data.hobbies)
      setSubCategories(res.data.hobbies)
    })
    getAllHobbies(`level=3&populate=category,sub_category,tags`, (err, res) => {
      if (err) return console.log(err)
      setHobbyData(res.data.hobbies)
    })
  }

  useEffect(() => {
    resetHobbiesData()
  }, [])

  return (
    <>
      <div className={`site-container ${styles['page-container']}`}>
        <aside>
          {/* Filters */}
          <div className={styles['filter-wrapper']}>
            <header>
              <h4 className={styles['heading']}>Filters</h4>
              <button onClick={handleFilter}>Apply</button>
            </header>

            <div className={styles['select-filter']}>
              <p>Category</p>
              <FormControl variant="outlined" fullWidth size="small">
                <Select
                  value={filterData.category}
                  onChange={(e) =>
                    setFilterData((prev) => {
                      return { ...prev, category: e.target.value }
                    })
                  }
                  displayEmpty
                  // inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">Select</MenuItem>
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
                      return { ...prev, subCategory: e.target.value }
                    })
                  }
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="">Select</MenuItem>
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
                value={filterData.hobby}
                onChange={(e) =>
                  setFilterData((prev) => {
                    return { ...prev, hobby: e.target.value }
                  })
                }
              />
            </div>
          </div>
        </aside>

        <main>
          <div className={styles['hobby-desc-container']}>
            <h1 className={styles['heading']}>Hobbies</h1>
            <div className={styles['text']}>
              <p>
                Here is a reference list of hobbies categorised primarily based on the research work
                of Dr. Robert Stebbins called Serious Leisure. Dr. Stebbins defines Series Leisure
                as a systematic pursuit of an amateur, hobbyist or volunteer that is substantial,
                rewarding and results in a sense of accomplishment. Here is a top-down view of the
                categorisation.
              </p>
              <p>
                While we maintain the same 5 top-level categories for a Hobbyist, the sub-categories
                may be slightly different. Each Category or Sub-Category has a dedicated page – just
                click on the name to navigate. Search on this page for any hobby and let us know if
                we’re missing something.
              </p>
            </div>
          </div>
          {categories.length > 0 && (
            <table className={styles['hobbies-table']}>
              <thead>
                <tr className="">
                  <th>Category</th>
                  <th>SubCategory</th>
                  <th>Hobby</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: any, i) => (
                  <tr key={i}>
                    <td className="">
                      <Link href={`/hobby/${cat.slug}`}>{cat.display}</Link>
                    </td>
                    <td>
                      {subCategories.map((subCat: any) => {
                        return (
                          subCat.category?._id === cat._id && (
                            <div>
                              <>
                                <p>
                                  <Link href={`/hobby/${subCat.slug}`}>{subCat.display}</Link>
                                </p>
                                <p>
                                  {hobbyData.map((hobby: any) => {
                                    return (
                                      hobby.category._id === cat._id &&
                                      hobby.sub_category._id === subCat._id && (
                                        <Link href={`/hobby/${hobby.slug}`}>
                                          <span> {hobby.display}, </span>
                                        </Link>
                                      )
                                    )
                                  })}
                                </p>
                              </>
                            </div>
                          )
                        )
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </>
  )
}

export default ALlHobbies
