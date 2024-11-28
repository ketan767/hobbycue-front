import React, { useState } from 'react'
import CustomDateRangePicker from './DateRangePicker/DateRangePicker'
import styles from './BlogFilter.module.css'
import { FormValues } from '@/pages/blog'
interface BlogFilterProps {
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
  formValues: FormValues
}

const BlogFilter: React.FC<BlogFilterProps> = ({
  setFormValues,
  formValues,
}) => {
  const [showCalender, setShowCalender] = useState(false)

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'radio' ? (checked ? value : prevValues.status) : value,
    }))
  }

  return (
    <section className={styles.blogsSection}>
      <h1 className={styles.blogsTitle}>Blogs</h1>
      <h2 className={styles.filter}>Filter</h2>

      <form className={styles.blogsForm}>
        <div className={styles.formGroup}>
          <label htmlFor="hobby" className={styles.formLabel}>
            Hobby
          </label>
          <input
            type="text"
            name="hobby"
            placeholder="Select Hobby"
            className={styles.formInput}
            value={formValues.hobby}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="genre" className={styles.formLabel}>
            Genre/Style
          </label>
          <input
            type="text"
            name="genre"
            placeholder="Select Genre/Style"
            className={styles.formInput}
            value={formValues.genre}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="keywords" className={styles.formLabel}>
            Keywords
          </label>
          <input
            type="text"
            name="keywords"
            placeholder="Title,Tagline,Keyword"
            className={styles.formInput}
            value={formValues.keywords}
            onChange={handleChange}
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
              <CustomDateRangePicker setFormValues={setFormValues} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BlogFilter
