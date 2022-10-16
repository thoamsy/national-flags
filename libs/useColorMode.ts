import { createContext, useContext } from 'react';

const ColorModeContext = createContext<{
  color: 'light' | 'dark';
  toggleColorMode: () => void;
}>({ toggleColorMode: () => {}, color: 'light' });

export default ColorModeContext;

export const useColorMode = () => useContext(ColorModeContext);
