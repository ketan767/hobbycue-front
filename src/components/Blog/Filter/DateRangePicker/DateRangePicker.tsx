import React, { forwardRef, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './DateRangePicker.module.css'
import { format } from 'date-fns'
import { FormValues } from '@/pages/blog'
interface CustomDateRangePickerProps {
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
}

function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy') // Converts to "14 NOV 2024"
}
const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  setFormValues,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ])

  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    // Handle startDate updates
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

    // Handle endDate updates
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
        selectsRange={true} // Date range selecting enabled
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update)
        }}
        inline
        calendarStartDay={1} // Starts from Monday
      />
    </div>
  )
}

export default CustomDateRangePicker
