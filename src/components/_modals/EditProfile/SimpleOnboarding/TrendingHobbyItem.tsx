import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import AddIcon from '@/assets/icons/AddIcon'

type PropsTypeTrendingHobbyItem = {
  item: any
  handleTrendingClick: (item: any) => void
  selectedHobbies: any[]
}

const TrendingHobbyItem: React.FC<PropsTypeTrendingHobbyItem> = ({
  item,
  handleTrendingClick,
  selectedHobbies,
}) => {
  const [show, setShow] = useState<boolean>(true)

  useEffect(() => {
    setShow(!selectedHobbies.some((el) => el?.display === item?.display))
  }, [selectedHobbies])

  return show ? (
    <button
      className={styles.trendingHobby}
      onClick={() => handleTrendingClick(item)}
    >
      <li>
        {item?.display}
        {item?.genre && ` - ${item?.genre?.display} `}
        <AddIcon />
      </li>
    </button>
  ) : (
    <></>
  )
}

export default TrendingHobbyItem
