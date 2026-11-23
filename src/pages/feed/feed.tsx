import { getFeed, getFeedSelector } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(getFeed());
  }, [dispatch]);
  const { orders, isLoading } = useSelector(getFeedSelector);

  const handleGetFeeds = (): void => {
    void dispatch(getFeed());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
