import { loginSelector, loginUser } from '@slices';
import { Preloader } from '@ui';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { loginError, loginRequest } = useSelector(loginSelector);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  if (loginRequest) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={loginError ? `Не удалось войти: ${loginError.message}` : ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
