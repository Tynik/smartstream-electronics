import React, { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';

import { netlifyRequest } from '~/api';

type AppContextValue = {
  isOpenMenu: boolean;
  toggleMenu: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  const { isFetching, isError } = useQuery({
    queryKey: ['verify-auth-token'],
    queryFn: () => netlifyRequest('verify-auth-token'),
  });

  const contextValue = useMemo<AppContextValue>(
    () => ({
      isOpenMenu,
      toggleMenu: () => setIsOpenMenu(!isOpenMenu),
    }),
    [isOpenMenu],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useCurrentApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('Could not find current App context');
  }

  return context;
};
