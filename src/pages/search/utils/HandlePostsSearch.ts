import { setPostedBy, setUserHobby, setUserLocation } from '@/redux/slices/search';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export default function useHandlePostsSearch() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePostsSearch = (
    currPostedBy: string,
    hobby: string,
    currLocation: string
  ) => {
    dispatch(setPostedBy(currPostedBy));
    dispatch(setUserHobby(hobby));
    dispatch(setUserLocation(currLocation));

    const query: Record<string, string> = { filter: 'posts' };
    if (currPostedBy) query.postedBy = currPostedBy;
    if (hobby) query.hobby = hobby;
    if (currLocation) query.location = currLocation;

    router.push({
      pathname: '/search',
      query,
    });
  };

  return handlePostsSearch;
}