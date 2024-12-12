import { setPostedBy, setUserHobby, setUserLocation } from '@/redux/slices/search';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export default function useHandlePostsSearch() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePostsSearch = (
    currPostedBy: string,
    selectedHobby: string,
    selectedLocation: string
  ) => {
    dispatch(setPostedBy(currPostedBy));
    dispatch(setUserHobby(selectedHobby));
    dispatch(setUserLocation(selectedLocation));

    const query: Record<string, string> = { filter: 'posts' };
    if (currPostedBy) query.postedBy = currPostedBy;
    if (selectedHobby) query.hobby = selectedHobby;
    if (selectedLocation) query.location = selectedLocation;

    router.push({
      pathname: '/search',
      query,
    });
  };

  return handlePostsSearch;
}