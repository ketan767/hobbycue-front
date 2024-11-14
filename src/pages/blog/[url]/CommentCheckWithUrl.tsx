import { FC, useEffect, useState } from 'react';
import styles from './BlogCard.module.css';

interface CommentCheckWithUrlProps {
  children: React.ReactNode;
}

interface TextWithLinkProps {
  text: string;
  pageUrlClass: string;
  contentClass: string;
}

const TextWithLink: FC<TextWithLinkProps> = ({ text, pageUrlClass, contentClass }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <p className={contentClass}>
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            className={pageUrlClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  );
};

const CommentCheckWithUrl: FC<CommentCheckWithUrlProps> = ({ children }) => {
  const [url, setUrl] = useState<null | string>(null);
  const pageUrlClass = styles.postUrl;
  const contentClass = styles.content;

  useEffect(() => {
    const checkUrl = () => {
      const regex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/;
      const urlMatch = children?.toString().match(regex);
      if (urlMatch) {
        setUrl(urlMatch[0]);
      }
    };
    checkUrl();
  }, [children]);

  if (typeof url === 'string') {
    return (
      <TextWithLink
        text={children?.toString() || ''}
        pageUrlClass={pageUrlClass}
        contentClass={contentClass}
      />
    );
  } else {
    return <p className={contentClass}>{children}</p>;
  }
};

export default CommentCheckWithUrl;
