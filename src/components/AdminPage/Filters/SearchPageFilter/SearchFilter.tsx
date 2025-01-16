import React from 'react'

import styles from './SearchFilter.module.css'

import { useSearchPageContext } from '@/pages/admin/searches'

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
    setFilterState({
      keyword: '',
      user: '',
      filterValue: '',
    })
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
        <div className={styles.keyword}>
          <label htmlFor="" style={{marginLeft:"1%"}}>Keywords</label>

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
        <FilterDropdown />
       
      </div>
    </main>
  )
}

export default SearchFilter
