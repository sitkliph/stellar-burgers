import { userDataSelector } from '@slices';
import { AppHeaderUI } from '@ui';

import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector(userDataSelector)?.name ?? undefined;

  return <AppHeaderUI userName={userName} />;
};
