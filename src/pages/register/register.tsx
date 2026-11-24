import { registerSelector, registerUser } from '@slices';
import { Preloader } from '@ui';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { registerError, registerRequest } = useSelector(registerSelector);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(registerUser({ email, password, name: userName }));
  };

  if (registerRequest) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={
        registerError ? `Не удалось зарегистрироваться: ${registerError.message}` : ''
      }
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
