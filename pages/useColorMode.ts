import { createContext, useContext } from 'react';

export const ColorModeContext = createContext<{
  color: 'light' | 'dark';
  toggleColorMode: () => void;
}>({ toggleColorMode: () => {}, color: 'light' });
export const useColorMode = () => useContext(ColorModeContext);
