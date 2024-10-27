import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { AccountProfile, NetlifyRequestResponse } from '~/api';
import { ACCOUNT_PROFILE_QUERY_KEY, SIGN_IN_ROUTE_PATH } from '~/constants';
import { getAccountProfile, netlifyRequest } from '~/api';
import { getCookieValue } from '~/helpers';

type AppContextValue = {
  isOpenMenu: boolean;
  toggleMenu: () => void;
  accountProfile: AccountProfile | undefined;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

type AppProviderProps = {
  children: (context: AppContextValue) => ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const navigate = useNavigate();

  const [isOpenMenu, setIsOpenMenu] = useState(true);

  const authToken = getCookieValue('authToken');

  useQuery({
    queryKey: ['verify-auth-token'],
    queryFn: async () => {
      try {
        return await netlifyRequest('verify-auth-token');
      } catch (e) {
        const response = e as NetlifyRequestResponse;

        if (response.status !== 'ok') {
          navigate(SIGN_IN_ROUTE_PATH);

          return Promise.reject(response);
        }
      }

      return Promise.reject(null);
    },
    refetchInterval: 900000, // 15 minutes
    enabled: Boolean(authToken),
  });

  const { data: accountProfile, isInitialLoading: isAccountProfileLoading } = useQuery({
    queryKey: ACCOUNT_PROFILE_QUERY_KEY,
    queryFn: getAccountProfile,
    enabled: Boolean(authToken),
  });

  const contextValue = useMemo<AppContextValue>(
    () => ({
      isOpenMenu,
      toggleMenu: () => setIsOpenMenu(!isOpenMenu),
      accountProfile,
    }),
    [isOpenMenu, accountProfile],
  );

  return <AppContext.Provider value={contextValue}>{children(contextValue)}</AppContext.Provider>;
};

export const useCurrentApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('Could not find current App context');
  }

  return context;
};
