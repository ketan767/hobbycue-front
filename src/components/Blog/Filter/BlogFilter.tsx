import React, { useEffect, useRef, useState } from 'react'
import CustomDateRangePicker from './DateRangePicker/DateRangePicker'
import styles from './BlogFilter.module.css'
import { FormValues } from '@/pages/blog'
import {
  getAllHobbies,
  getAllHobbiesWithoutPagi,
} from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { DropdownListItem } from '@/components/_modals/AdminModals/EditpostsModal'

interface BlogFilterProps {
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
  formValues: FormValues
}

const BlogFilter: React.FC<BlogFilterProps> = ({
  setFormValues,
  formValues,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const hobbyRef = useRef<HTMLParagraphElement | null>(null)
  const styleRef = useRef<HTMLParagraphElement | null>(null)

  const [showCalender, setShowCalender] = useState(false)
  const [showStyle, setShowStyle] = useState(false)
  const [showHobby, setShowHobby] = useState(false)
  const [data, setData] = useState({ hobby: null, genre: null })
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [hobbyDropdownList, setHobbyDropdownList] = useState<any[]>([])
  const [genreDropdownList, setGenreDropdownList] = useState<any[]>([])
  const [allHobbiesList, setAllHobbiesList] = useState<any[]>([])
  const [allGenreList, setAllGenreList] = useState<any[]>([])
  const [genreId, setGenreId] = useState('')
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState(-1)
  const [focusedGenreIndex, setFocusedGenreIndex] = useState(-1)
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'radio' ? (checked ? value : prevValues.status) : value,
    }))
  }

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    setFormValues((prevValues) => ({
      ...prevValues,
      keywords: value,
    }))

    if (!value.trim()) {
      return
    }

    const searchQuery = value.toLowerCase()

    const combinedData = [...allHobbiesList, ...allGenreList]

    const filteredResults = combinedData.filter((item) =>
      ['display', 'author', 'title', 'tagline', 'hobby'].some((field) =>
        item[field]?.toLowerCase().includes(searchQuery),
      ),
    )

    const uniqueResults = Array.from(
      new Map(filteredResults.map((item) => [item.id, item])).values(),
    )

    setFormValues((prevValues) => ({
      ...prevValues,
      searchResults: uniqueResults,
    }))
  }

  const handleHobbyInputChange = async (e: any) => {
    const { name, value, type, checked } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'radio' ? (checked ? value : prevValues.status) : value,
    }))
    setShowHobby(true)
    setHobbyInputValue(e.target.value)
    setGenreInputValue('')
    setGenreDropdownList([])
    setGenreId('')

    if (isEmptyField(e.target.value)) {
      setHobbyDropdownList([])
      setFocusedHobbyIndex(-1)
      return
    }

    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const query2 = `fields=display,genre&level=5&level=4&level=3&level=2&level=1&level=0&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)
    const { err: err2, res: res2 } = await getAllHobbiesWithoutPagi(query2)
    if (err) return console.log(err)
    if (err2) return console.log(err2)

    let sortedHobbies = res.data.hobbies
    let allHobbies = res2.data.hobbies

    if (e.target.value.toLowerCase() === 'sing') {
      // Prioritize "vocal music" at the top
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
        if (a.display.toLowerCase() === 'vocal music') return -1
        if (b.display.toLowerCase() === 'vocal music') return 1
        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
    } else {
      // Sort alphabetically
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
        const indexA = a.display
          .toLowerCase()
          .indexOf(e.target.value.toLowerCase())
        const indexB = b.display
          .toLowerCase()
          .indexOf(e.target.value.toLowerCase())

        if (indexA === 0 && indexB !== 0) {
          return -1
        } else if (indexB === 0 && indexA !== 0) {
          return 1
        }

        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
    }
    setAllHobbiesList(allHobbies)

    setHobbyDropdownList(sortedHobbies)
    setFocusedHobbyIndex(-1)
  }

  const handleGenreInputChange = async (e: any) => {
    const { name, value, type, checked } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'radio' ? (checked ? value : prevValues.status) : value,
    }))
    setGenreInputValue(e.target.value)

    if (isEmptyField(e.target.value)) return setGenreDropdownList([])
    const query = `fields=display&show=true&genre=${genreId}&level=5`
    const query2 = `fields=display,show&genre=${genreId}&level=5`

    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    const { err: err2, res: res2 } = await getAllHobbiesWithoutPagi(query2)
    if (err2) return console.log(err2)

    // Step 1: Filter the data based on the search query
    const filteredGenres = res.data.hobbies.filter((item: any) => {
      return item.display.toLowerCase().includes(e.target.value.toLowerCase())
    })
    const allFilteredGenres = res2.data.hobbies.filter((item: any) => {
      return item.display.toLowerCase().includes(e.target.value.toLowerCase())
    })
    // Step 2: Sort the filtered data
    const sortedGenres = filteredGenres.sort((a: any, b: any) => {
      const indexA = a.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())
      const indexB = b.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())

      if (indexA === 0 && indexB !== 0) {
        return -1
      } else if (indexB === 0 && indexA !== 0) {
        return 1
      }

      return 0
    })

    setGenreDropdownList(sortedGenres)
    setAllGenreList(allFilteredGenres)
    console.log('all----------------->', allFilteredGenres)
    setFocusedGenreIndex(-1)
  }

  const handleHobbySelection = async (selectedHobby: DropdownListItem) => {
    setGenreId('')

    setHobbyInputValue(selectedHobby?.display ?? hobbyInputValue)

    if (
      selectedHobby &&
      selectedHobby.genre &&
      selectedHobby.genre.length > 0
    ) {
      setGenreId(selectedHobby.genre[0])

      const query = `fields=display&show=true&genre=${selectedHobby.genre[0]}&level=5`
      const { err, res } = await getAllHobbies(query)

      if (!err) {
        setGenreDropdownList(res.data.hobbies)
      } else {
      }
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      hobby: selectedHobby?.display,
    }))
    setShowHobby(false)
  }

  const handleGenreSelection = async (x: any) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      genre: x?.display,
    }))
    setShowStyle(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hobbyRef.current &&
        !hobbyRef.current.contains(event.target as Node)
      ) {
        console.log(55)

        setShowHobby(false)
      }
      if (
        styleRef.current &&
        !styleRef.current.contains(event.target as Node)
      ) {
        setShowStyle(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <section className={styles.blogsSection} ref={containerRef}>
      <h1 className={styles.blogsTitle}>Blogs</h1>
      <h2 className={styles.filter}>Filter</h2>

      <form className={styles.blogsForm}>
        <div className={`${styles.formGroup} ${styles.position}`}>
          <label htmlFor="hobby" className={styles.formLabel}>
            Hobby
          </label>
          <input
            type="text"
            name="hobby"
            placeholder="Select Hobby"
            className={styles.formInput}
            value={formValues.hobby}
            onChange={handleHobbyInputChange}
            onClick={() => setShowHobby(true)}
          />

          {showHobby && hobbyDropdownList.length > 0 && (
            <p
              ref={hobbyRef}
              id="hobby-dropdown"
              className={styles.resultContainer}
            >
              {hobbyDropdownList?.map((x, i) => (
                <span key={i} onClick={() => handleHobbySelection(x)}>
                  {x?.display}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className={`${styles.formGroup} ${styles.position}`}>
          <label htmlFor="genre" className={styles.formLabel}>
            Genre/Style
          </label>
          <input
            type="text"
            name="genre"
            placeholder="Select Genre/Style"
            className={styles.formInput}
            value={formValues.genre}
            onChange={handleGenreInputChange}
            onClick={() => setShowStyle(true)}
          />
          {showStyle && genreDropdownList.length > 0 && (
            <p
              ref={styleRef}
              id="style-dropdown"
              className={styles.resultContainer}
            >
              {genreDropdownList?.map((x, i) => (
                <span key={i} onClick={() => handleGenreSelection(x)}>
                  {x?.display}
                </span>
              ))}
            </p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="keywords" className={styles.formLabel}>
            Keywords
          </label>
          <input
            type="text"
            name="keywords"
            placeholder="Title, Tagline, Keyword"
            className={styles.formInput}
            value={formValues.keywords}
            onChange={handleChangeKeyword}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="author" className={styles.formLabel}>
            Author
          </label>
          <input
            type="text"
            name="author"
            className={styles.formInput}
            value={formValues.author}
            onChange={handleChange}
          />
        </div>
      </form>

      <div className={styles.blogsOptions}>
        <h3 className={styles.dates}>Dates</h3>

        <div className={styles.radioGroup}>
          <p className={styles.radioItem}>
            <input
              type="radio"
              name="status"
              value="published"
              id="published"
              className={styles.radioInput}
              checked={formValues.status === 'published'}
              onChange={handleChange}
            />
            <label htmlFor="published" className={styles.radioLabel}>
              Published
            </label>
          </p>
          <p className={styles.radioItem}>
            <input
              type="radio"
              name="status"
              value="update"
              id="update"
              className={styles.radioInput}
              checked={formValues.status === 'update'}
              onChange={handleChange}
            />
            <label htmlFor="update" className={styles.radioLabel}>
              Update
            </label>
          </p>
        </div>

        <div className={styles.datePickerContainer}>
          <p onClick={() => setShowCalender((pre) => !pre)}>
            <span className={styles.showDate}>{formValues.startDate}</span>
            <span className={styles.showDate}>{formValues.endDate}</span>
          </p>

          {showCalender && (
            <div className={styles.datePickerWrapper}>
              <CustomDateRangePicker
                setFormValues={setFormValues}
                setShowCalender={setShowCalender}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BlogFilter
