import { createContext, useContext, useEffect, useState } from 'react';

import { isAuthenticatedApi } from '../features/auth/api';

const authUserTypesConst = ['user', 'admin'];

export const authUserTypes = [...authUserTypesConst];

const AuthContext = createContext({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  isReady: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // check if authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      const data = await isAuthenticatedApi();

      if (!data || Object.keys(data).length === 0) {
        setIsReady(true);
        return;
      }
      setUser({
        id: data.id,
        email: data.email,
        userType: data.userType,
        name: `${data.firstname} ${data.lastname}`,
      });
      setIsReady(true);
    };
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};
