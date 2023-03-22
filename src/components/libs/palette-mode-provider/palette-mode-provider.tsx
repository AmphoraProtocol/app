import { PaletteMode, createTheme, ThemeProvider } from '@mui/material';
import { createContext, useState } from 'react';
import { getDesignTokens } from '~/theme';

export type PaletteModeContextType = {
  toggleMode: () => void;
};

export const PaletteModeContext = createContext<PaletteModeContextType>({} as PaletteModeContextType);

export const PaletteModeContextProvider = ({ children }: { children: React.ReactElement }) => {
  // default light dark mode on start
  const [mode, setMode] = useState<PaletteMode>((): PaletteMode => {
    const paletteMode = localStorage.getItem('paletteMode') as PaletteMode | null;

    if (paletteMode === null) {
      return 'light';
    }
    return paletteMode;
  });

  const theme = createTheme(getDesignTokens(mode));

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';

    setMode(newMode);

    localStorage.setItem('paletteMode', newMode);
  };

  return (
    <PaletteModeContext.Provider value={{ toggleMode }}>
      <ThemeProvider {...{ theme }}>{children}</ThemeProvider>
    </PaletteModeContext.Provider>
  );
};
