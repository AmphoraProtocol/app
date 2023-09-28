import { StrictMode, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import './theme/styles.css';

import { PaletteModeContextProvider } from './components/libs/palette-mode-provider/palette-mode-provider';
import Dashboard from './pages/dashboard';
import LandingPage from './pages/landing';
import NotFound404Page from './pages/404';
// import Buy from './pages/buy';
import Root from './pages/root';
import Wrap from './pages/wrap';

const AppRouter = () => {
  return (
    <Routes>
      <Route path={`/landing`} element={<LandingPage />} />
      <Route path={`*`} element={<NotFound404Page />} />

      <Route path={`/`} element={<Root />} errorElement={<NotFound404Page />}>
        <Route index={true} element={<Dashboard />} />
        {/*<Route path={`buy`} element={<Buy />} />*/}
        <Route path={`wrap`} element={<Wrap />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <StrictMode>
      <Suspense fallback={<p>Loading...</p>}>
        <StyledEngineProvider injectFirst>
          <PaletteModeContextProvider>
            <>
              <CssBaseline />
              <AppRouter />
            </>
          </PaletteModeContextProvider>
        </StyledEngineProvider>
      </Suspense>
    </StrictMode>
  );
};

export default App;
