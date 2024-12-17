import React from 'react'

import styles from './SearchFilter.module.css'

import { useSearchPageContext } from '@/pages/admin/searchHistory'

import FilterDropdown from './FilterDropDown/FilterDropDown'
import UserDropdown from './UserDropDown/UserDropDown'

interface SearchFilterProps {
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  setIsModalOpen,
  setApplyFilter,
}) => {
  const { filterState, setFilterState } = useSearchPageContext()
  const handleApply = () => {
    setApplyFilter?.(true)
    setIsModalOpen?.(false)
  }
  const handleClear = () => {
    setIsModalOpen?.(false)
  }

  return (
    <main className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Filter</h2>
        <div className={styles.wrapper}>
          <button className={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
      <div className={styles.modalBody}>
        <UserDropdown />
        <FilterDropdown />
        <div className={styles.keyword}>
          <label htmlFor="">Keywords</label>

          <input
            type="text"
            placeholder="Keywords"
            value={filterState.keyword.toString() ?? ''}
            onChange={(e) =>
              setFilterState?.((pre: any) => {
                return { ...pre, keyword: e.target.value }
              })
            }
          />
        </div>
      </div>
    </main>
  )
}

export default SearchFilter
