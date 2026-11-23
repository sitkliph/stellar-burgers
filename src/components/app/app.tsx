import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { getIngredients, getIngredientsSelector, checkUserAuth } from '@slices';
import { Preloader } from '@ui';
import { type JSX, type ReactElement, useEffect } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useMatch,
  useNavigate,
  useRoutes,
} from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const AppLayout = (): JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);
  const { ingredients, loading, error } = useSelector(getIngredientsSelector);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent ingredients={ingredients} isLoading={loading} error={error} />
    </div>
  );
};

const AppContent = ({ ingredients, isLoading, error }: AppContentProps): JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <Outlet />;
};

const RoutesWithModals = (): JSX.Element => {
  const navigate = useNavigate();

  const location = useLocation();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  const feedOrderMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const orderNumber = (feedOrderMatch ?? profileOrderMatch)?.params.number;

  const pages = useRoutes(
    [
      { index: true, element: <ConstructorPage /> },
      { path: 'feed', element: <Feed /> },
      { path: 'feed/:number', element: <OrderInfo /> },
      { path: 'ingredients/:id', element: <IngredientDetails /> },
      {
        path: 'profile/orders',
        element: (
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/orders/:number',
        element: (
          <ProtectedRoute>
            <OrderInfo />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFound404 /> },
    ],
    background ?? location
  );

  const handleClose = (): void => {
    void navigate(-1);
  };

  const ModalRoutes = (): ReactElement | null =>
    useRoutes([
      {
        path: 'feed/:number',
        element: (
          <Modal title={`#${orderNumber?.padStart(6, '0')}`} onClose={handleClose}>
            <OrderInfo />
          </Modal>
        ),
      },
      {
        path: 'ingredients/:id',
        element: (
          <Modal title={'Детали ингредиента'} onClose={handleClose}>
            <IngredientDetails />
          </Modal>
        ),
      },
      {
        path: '/profile/orders/:number',
        element: (
          <ProtectedRoute>
            <Modal title={`#${orderNumber?.padStart(6, '0')}`} onClose={handleClose}>
              <OrderInfo />
            </Modal>
          </ProtectedRoute>
        ),
      },
    ]);

  return (
    <>
      {pages}
      {background && <ModalRoutes />}
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/*', element: <RoutesWithModals /> },
      {
        path: '/login',
        element: (
          <ProtectedRoute onlyUnAuth>
            <Login />
          </ProtectedRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <ProtectedRoute onlyUnAuth>
            <Register />
          </ProtectedRoute>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <ProtectedRoute>
            <ForgotPassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default function App(): JSX.Element {
  return <RouterProvider router={router} />;
}
