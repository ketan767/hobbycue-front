import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

import Image from 'next/image'

import LogoFull from '@/assets/png/logo-full.png'

import styles from './Navbar.module.css'
import OutlinedButton from '../_buttons/OutlinedButton'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { updateIsLoggedIn } from '@/redux/slices/user'
import Link from 'next/link'

type Props = {}

export const Navbar: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  return (
    <header className={`${styles['navbar-wrappper']}`}>
      <nav className={`site-container `}>
        <Link href={'/'}>
          <Image
            src={LogoFull}
            alt="HobbyCue Logo"
            placeholder="blur" // Optional blur-up while loading
            priority
          />
        </Link>

        <TextField
          variant="outlined"
          placeholder="Search here..."
          size="small"
          sx={{
            '& .MuiInputBase-input': {
              fontSize: '15px',
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              padding: 0,
              overflow: 'hidden',
            },
          }}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    bgcolor: 'primary.main',
                    borderRadius: '0px 8px 8px 0px',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  <SearchIcon sx={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <OutlinedButton onClick={() => dispatch(openModal('auth'))}>Sign In</OutlinedButton>
      </nav>
    </header>
  )
}
