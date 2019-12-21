import { createContext, useContext } from 'react';

export const FirebaseContext = createContext();

export default () => {
  return useContext(FirebaseContext);
};
