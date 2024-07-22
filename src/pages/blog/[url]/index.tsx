import { GetServerSideProps } from 'next'
import { getAllBlogs } from '@/services/blog.services'
import styles from './../styles.module.css'
import BlogComments from './Comments'
type Props = {
  data: {
    blog_url?: any
  }
}

const BlogPage: React.FC<Props> = ({ data }) => {
  const blogUrl = data?.blog_url?.url || ''
  console.warn('blogdataaaaaaaa', data)
  return (
    <>
      <div className={styles['iframe-container']}>
        <iframe
          className={styles['iframe']}
          src={`https://blog.hobbycue.com/blog/${blogUrl}`}
        ></iframe>
      </div>
      <div>
        <BlogComments data={data.blog_url} />
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllBlogs(`url=${query['url']}`)

  if (!res || !res.data.success || res.data.data.blog.length === 0) {
    return {
      notFound: true,
    }
  }

  const data = {
    blog_url: res.data.data.blog[0],
  }

  return {
    props: {
      data,
    },
  }
}

export default BlogPage
