import { TextField } from '@mui/material'
import Image from 'next/image'
import React, { useRef } from 'react'
import styles from '../styles.module.css'
import SearchIcon from '@/assets/svg/search.svg'
import { setPostedBy } from '@/redux/slices/search'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

type PostFieldProps = {
  currPostedBy: string
  setCurrPostedBy: (name: string) => void
  selectedLocation: string
  selectedHobby: String
}
const PostField: React.FC<PostFieldProps> = ({
  currPostedBy,
  setCurrPostedBy,
  selectedLocation,
  selectedHobby,
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const postedByRef = useRef<HTMLInputElement>(null)

  return (
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
            if (selectedHobby) {
              query = { ...query, hobby: selectedHobby }
            }
            if (selectedLocation) {
              query = { ...query, location: selectedLocation }
            }
            router.push({
              pathname: `/search`,
              query: query,
            })
          }
        }}
        value={currPostedBy}
        // onBlur={() =>
        //   setTimeout(() => {
        //     setShowHobbyDropdown(false)
        //   }, 300)
        // }
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
  )
}

export default PostField