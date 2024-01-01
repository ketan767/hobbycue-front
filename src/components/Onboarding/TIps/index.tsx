import Image from 'next/image'
import PropTypes from 'prop-types'
import styles from './style.module.css'

export default function TipsCard({
  title,
  description,
  sliceIcon,
  routeName,
  customStyle,
}: any) {
  return (
    <div style={customStyle} className={`${styles['modal-wrapper']}`}>
      <Image
        src={sliceIcon}
        alt="icon"
        style={{ position: 'absolute', top: -18, left: 20 }}
      />
      <div className={`${styles['modalContent']}`}>
        <h2 className={`${styles['titleStyle']}`}>{title}</h2>
        <p className={`${styles['descriptionStyle']}`}>{description}</p>
        <button className={`${styles['buttonStyle']}`}>{title}</button>
      </div>
    </div>
  )
}

TipsCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  routeName: PropTypes.string,
}
