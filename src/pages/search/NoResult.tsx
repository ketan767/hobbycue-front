import { useRouter } from 'next/router'
import styles from './styles.module.css'
import img204 from '@/assets/image/_204.png'
import Link from 'next/link'
import { isMobile } from '@/utils'
import Filter from './Filter'

const NoResult = () => {
  const router = useRouter()
  const { q = '', filter = '' } = router.query
  const filterMap: { [key: string]: string } = {
    hobby: 'Hobbies',
    users: 'User Profiles',
    people: 'People Pages',
    places: 'Places',
    programs: 'Programs',
    products: 'Products',
    blogs: 'Blogs',
    posts: 'Posts',
    classes: 'Classes',
    rentals: 'Rentals',
  }
  const isMob = isMobile()
  return (
    <div className={styles['no-results-wrapper']}>
      {q !== '' && (
        <div className={styles.imageDiv}>
          <img src={img204.src} alt="No Result Found" />
        </div>
      )}

      <div className={styles.main}>
        {q !== '' ? (
          <h1>
            Mm-hmm... No results for "{q}"{' '}
            {filter ? `under ${filterMap[filter.toString()]}` : ``}
          </h1>
        ) : (
          <h1>
            {' '}
            Use the <strong> Search box</strong> at the top to look for anything
            on your hobbies.
          </h1>
        )}

        {q !== '' ? (
          <p>
            Please check for spelling errors or try a shorter search string.
            {!isMob ? <br /> : ' '}
            Alternately, you can Explore <span>Pages</span> using the below.
          </p>
        ) : (
          <p>Alternately, you can Explore Pages using the below.</p>
        )}
        <div className={styles.filterParent}>
          <Filter />
        </div>
      </div>

      <div className={styles.wrapperFooter}>
        <p>Are we missing a listing ?</p>
        <button>
          <Link href="/add-listing">Add New</Link>
        </button>
      </div>
    </div>
  )
}

export default NoResult