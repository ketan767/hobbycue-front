import React, { forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './DateRangePicker.module.css'
import { format } from 'date-fns'
import { FormValues } from '@/pages/blog'
interface CustomDateRangePickerProps {
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
  setShowCalender: React.Dispatch<React.SetStateAction<boolean>>
  focusTarget?: 'startDate' | 'endDate'
  formValues?: any
}
function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy') // Converts to "14 NOV 2024"
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  setFormValues,
  setShowCalender,
  focusTarget,
  formValues,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    if (dateRange[0]) {
      setStartDate(dateRange[0])
      const formattedStartDate = formatDate(dateRange[0])
      setFormValues((prevValues: FormValues) => ({
        ...prevValues,
        startDate: formattedStartDate,
      }))
    } else {
      setStartDate(undefined)
    }

    if (dateRange[1]) {
      setEndDate(dateRange[1])
      const formattedEndDate = formatDate(dateRange[1])
      setFormValues((prevValues: FormValues) => ({
        ...prevValues,
        endDate: formattedEndDate,
      }))
    } else {
      setEndDate(undefined)
    }
  }, [dateRange, setFormValues])

  return (
    <div className={styles.containerWrapper}>
      <DatePicker
        className={styles.container}
        selectsRange={true}
        startDate={startDate}
        minDate={focusTarget === 'endDate' ? formValues?.startDate : undefined}
        endDate={endDate}
        onChange={(update: [Date | null, Date | null]) => {
          if (focusTarget === 'startDate') {
            setDateRange([update[0], dateRange[1]])
            if (update[0]) {
              const formattedStartDate = formatDate(update[0])
              setFormValues((prevValues: FormValues) => ({
                ...prevValues,
                startDate: formattedStartDate,
              }))
            }
          } else if (focusTarget === 'endDate') {
            setDateRange([dateRange[0], update[1]])
            if (update[0]) {
              const formattedEndDate = formatDate(update[0])

              setFormValues((prevValues: FormValues) => ({
                ...prevValues,
                endDate: formattedEndDate,
              }))
            }
          }

          if (update[0] && update[1]) {
            setShowCalender(false)
          }
        }}
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className={styles.customHeader}>
            <button
              type="button"
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={styles.navButton}
            >
              {'<'}
            </button>
            <div className={styles.headerContent}>
              <span
                className={styles.monthClickable}
                onClick={() => {
                  const dropdown = document.getElementById('month-dropdown')
                  if (dropdown) {
                    dropdown.style.display =
                      dropdown.style.display === 'block' ? 'none' : 'block'
                  }
                }}
              >
                {new Date(date).toLocaleString('default', { month: 'long' })}
              </span>
              <span
                className={styles.yearClickable}
                onClick={() => {
                  const dropdown = document.getElementById('year-dropdown')
                  if (dropdown) {
                    dropdown.style.display =
                      dropdown.style.display === 'block' ? 'none' : 'block'
                  }
                }}
              >
                {new Date(date).getFullYear()}
              </span>
            </div>
            <button
              type="button"
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={styles.navButton}
            >
              {'>'}
            </button>
            <div
              id="month-dropdown"
              className={styles.monthDropdown}
              style={{ display: 'none' }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => {
                    changeMonth(i)
                    const dropdown = document.getElementById('month-dropdown')
                    if (dropdown) dropdown.style.display = 'none'
                  }}
                  className={styles.monthOption}
                >
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </div>
              ))}
            </div>
            <div
              id="year-dropdown"
              className={styles.yearDropdown}
              style={{ display: 'none' }}
            >
              {Array.from({ length: 30 }, (_, i) => 2000 + i).map((year) => (
                <div
                  key={year}
                  onClick={() => {
                    changeYear(year)
                    const dropdown = document.getElementById('year-dropdown')
                    if (dropdown) dropdown.style.display = 'none'
                  }}
                  className={styles.yearOption}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        )}
        inline
        calendarStartDay={1}
      />
    </div>
  )
}

export default CustomDateRangePicker
