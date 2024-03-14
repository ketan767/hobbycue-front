import { FC } from 'react';
import styles from './styles.module.css'
import hc404Img from "@/assets/image/hc_404.png"
import hcRestrictedImg from "@/assets/image/hc_restricted_link.png"
import Image from 'next/image';

interface ErrorPageProps {
  restricted?:boolean
}

const ErrorPage: FC<ErrorPageProps> = ({restricted=false}) => {
  return <div className={styles['container']}>
    <Image src={restricted?hcRestrictedImg:hc404Img} alt='Error Page Image' className={styles['heroImg']}/>
    <div className={styles['contentContainer']+` ${restricted?styles['moveUp']:""}`}>
      <h1>Content unavailable</h1>
      <p>Oops! Please re-check the link. If it seems correct, maybe the owner has restricted who can view, or the content has been deleted. You may <span>Visit Help Center</span> for more information</p>
    </div>
    <div className={restricted?styles['flexRowContainer']:styles['flexColContainer']}>
      <button className={styles['btnSecondary']}>Go Back</button>
      <button className={styles['btnPrimary']}>Home Page</button>
    </div>
  </div>
}

export default ErrorPage