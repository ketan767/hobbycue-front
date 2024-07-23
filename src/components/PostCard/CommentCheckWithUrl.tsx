import { FC, useEffect, useState } from 'react'
import styles from './PostCard.module.css'

interface CommentCheckWithUrlProps {
  children: React.ReactNode
}

const CommentCheckWithUrl: FC<CommentCheckWithUrlProps> = ({ children }) => {
  const [url, setUrl] = useState<null | string>(null)
  const pageUrlClass = styles.postUrl
  useEffect(() => {
    const checkUrl = () => {
      const regex =
        /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
      const url = children?.toString().match(regex)
      if (url) {
        setUrl(url[0])
      }
    }
    checkUrl()
  }, [children])
  if (typeof url === 'string')
    return (
      <a href={url} className={pageUrlClass} target="_blank">
        {children}
      </a>
    )
  else return <p className={styles['comment-content']}>{children}</p>
}

export default CommentCheckWithUrl
