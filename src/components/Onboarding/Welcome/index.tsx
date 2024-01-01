import Image from 'next/image'
import PropTypes from 'prop-types'
import styles from './welcome.module.css'

export default function Welcome({ iconSrc, title, description }: any) {
  return (
    <div className={`${styles['modal-wrapper']}`}>
      <div className={`${styles['modalContent']}`}>
        <div className={`${styles['iconContainerStyle']}`}>
          <Image
            src={iconSrc}
            className={`${styles['iconStyle']}`}
            alt="icon"
          />
        </div>
        <h2 className={`${styles['titleStyle']}`}>{title}</h2>
        <p className={`${styles['descriptionStyle']}`}>{description}</p>
      </div>
    </div>
  )
}

Welcome.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
