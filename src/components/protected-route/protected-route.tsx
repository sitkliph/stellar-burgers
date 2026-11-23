import { isAuthCheckedSelector, isAuthenticatedSelector } from '@slices/userSlice.ts';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.ReactElement => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const state = location.state as { from?: Location } | null;
    return <Navigate replace to={state?.from ?? '/'} />;
  }

  return children;
};
