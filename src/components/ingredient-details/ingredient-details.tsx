import { getIngredientsSelector } from '@slices';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store.ts';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<'id'>();
  const { ingredients } = useSelector(getIngredientsSelector);
  const ingredientData = ingredients.find((ingredient) => ingredient._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
