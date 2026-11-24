import {
  cleanOrderModalData,
  getConstructor,
  isAuthenticatedSelector,
  orderBurger,
  orderBurgerSelector,
} from '@slices';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructor);
  const { orderRequest, orderModalData } = useSelector(orderBurgerSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];
    void dispatch(orderBurger(ingredientIds));
  };

  const closeOrderModal = (): void => {
    dispatch(cleanOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
