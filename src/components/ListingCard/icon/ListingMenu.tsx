import React from 'react'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MoreIcon from '@/assets/svg/listing-more-icon.svg'
import styles from './ListingMenu.module.css'
import Image from 'next/image';

interface Props {
  isCardHovered: boolean
}

const ListingMenu = ({isCardHovered}: Props) => {
  return (
    <div
      // onClick={() => showFeatureUnderDevelopment()}
      className={styles['action-btn']}
      style={isCardHovered ? { opacity: 1 } : { opacity: 0.3 }}
    >
      {/* <MoreVertRoundedIcon color="primary" /> */}
      <Image src={MoreIcon} width={19.5} height={19.5} alt="More" />
    </div>
  )
}

export default ListingMenu
