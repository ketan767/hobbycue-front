import styles from './styles.module.css';
import img404 from '@/assets/image/_404.png';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const ErrorPage = ({ restricted = false }: { restricted?: boolean }) => {
  const imageUrl = img404.src;
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const focusableRefs = useRef<(HTMLButtonElement | HTMLAnchorElement)[]>([]); // Ref array for buttons and links
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent default tabbing behavior
      setCurrentIndex((prevIndex) => (prevIndex + 1) % focusableRefs.current.length); // Cycle focus
    }
  };

  useEffect(() => {
    // Set focus to the current element
    focusableRefs.current[currentIndex]?.focus();
  }, [currentIndex]);

  useEffect(() => {
    // Attach keydown listener on mount
    const handleKey = (e: KeyboardEvent) => handleKeyDown(e);
    window.addEventListener('keydown', handleKey);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className={styles['notfound-container']}>
      <img
        src={imageUrl}
        alt="Error Page Image"
        className={styles['notfoundImg']}
      />
      <div className={styles['contentContainer']}>
        <h1>Content unavailable</h1>
        <p>
          Oops! Please re-check the link. If it seems correct, maybe the owner
          has restricted who can view, or the content has been deleted.
          <br />
          You may try the{' '}
          <Link
            href="/search"
            ref={(el) => {
              if (el) focusableRefs.current[0] = el;
            }}
            className={styles.focusable} // Apply focusable class
          >
            Search option
          </Link>{' '}
          to find it or{' '}
          <Link
            href="/help"
            ref={(el) => {
              if (el) focusableRefs.current[1] = el;
            }}
            className={styles.focusable} // Apply focusable class
          >
            Visit Help Center
          </Link>{' '}
          for more information.
        </p>
      </div>
      <div className={styles['flexColContainer']}>
        <button
          onClick={() => router.back()}
          className={styles.btnSecondary}
          ref={(el) => {
            if (el) focusableRefs.current[2] = el;
          }}
        >
          Go Back
        </button>
        <button
          onClick={() =>
            router.replace(user?.isAuthenticated ? '/community' : '/')
          }
          className={`${styles['btnPrimary']}`}
          ref={(el) => {
            if (el) focusableRefs.current[3] = el;
          }}
        >
          Home Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
