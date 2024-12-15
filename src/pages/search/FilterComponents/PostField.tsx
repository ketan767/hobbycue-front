import { TextField } from '@mui/material'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import styles from '../styles.module.css'
import SearchIcon from '@/assets/svg/search.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '@/redux/store'
import usePostedByChange from './components/postFieldComponents/usePostedByChange'
import PostedByDropdown from './components/PostedByDropdown'
import usePostedByKeyDown from './components/postFieldComponents/usePostedByKeyDown'

type PostFieldProps = {
  filterPage?: string
  currPostedBy: string
  setCurrPostedBy: (name: string) => void
  selectedLocation: string
  selectedHobby: string
}
const PostField: React.FC<PostFieldProps> = ({
  filterPage,
  currPostedBy,
  setCurrPostedBy,
  selectedLocation,
  selectedHobby,
}) => {
  const router = useRouter()
  const postedByRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLDivElement | null>(null)
  const [showPostedByDropdown, setShowPostedByDropdown] = useState(false)
  const [postedByDropdownList, setPostedByDropdownList] = useState<string[]>([])
  const [isPostedBySelected, setIsPostedBySelected] = useState<boolean>(false)
  const [focusedPostedByIdx, setFocusedPostedByIdx] = useState<number>(-1)

  const handlePostedByChange = usePostedByChange(
    setFocusedPostedByIdx,
    setPostedByDropdownList,
  )

  const handlePostedByKeyDown = usePostedByKeyDown(
    postedByRef,
    setFocusedPostedByIdx,
    postedByDropdownList,
    focusedPostedByIdx,
    showPostedByDropdown,
    setShowPostedByDropdown,
    isPostedBySelected,
    setIsPostedBySelected,
    selectedHobby,
    selectedLocation,
    setCurrPostedBy,
    filterPage,
  )
  return (
    <div className={styles.hobbySuggestion} ref={inputRef}>
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
          if (e.key !== 'Enter') {
            setShowPostedByDropdown(true)
            setIsPostedBySelected(false)
          }
          handlePostedByKeyDown(e)
        }}
        onBlur={() =>
          setTimeout(() => {
            setShowPostedByDropdown(false)
          }, 300)
        }
        value={currPostedBy}
        onChange={(e) => {
          setCurrPostedBy(e.target.value)
          handlePostedByChange(e)
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
      {showPostedByDropdown && postedByDropdownList?.length !== 0 && (
        <PostedByDropdown
          inputRef={inputRef}
          postedByDropdownList={postedByDropdownList}
          postedByRef={postedByRef}
          focusedPostedByIdx={focusedPostedByIdx}
          setCurrPostedBy={setCurrPostedBy}
        />
      )}
    </div>
  )
}

export default PostField
