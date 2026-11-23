import { getUserOrders, getUserOrdersSelector } from '@slices';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  useEffect(() => {
    void dispatch(getUserOrders());
  }, [dispatch]);
  const { orders, loading, error } = useSelector(getUserOrdersSelector);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить Ваши заказы
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!orders.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Заказов еще нет</p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
