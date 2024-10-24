import React from 'react';

import { AppProvider } from '~/providers';
import { TopBar } from '~/components';

export const App = () => {
  return (
    <AppProvider>
      <TopBar />
    </AppProvider>
  );
};
