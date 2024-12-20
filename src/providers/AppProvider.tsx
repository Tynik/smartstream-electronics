import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { Profile, NetlifyRequestResponse } from '~/api';
import { PROFILE_QUERY_KEY, SIGN_IN_ROUTE_PATH } from '~/constants';
import { getProfile, netlifyRequest } from '~/api';
import { getCookieValue } from '~/helpers';

type AppContextValue = {
  isOpenMenu: boolean;
  toggleMenu: () => void;
  profile: Profile | undefined;
  refetchProfile: () => Promise<void>;
  isProfileLoading: boolean;
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
    refetchIntervalInBackground: true,
    enabled: Boolean(authToken),
  });

  const {
    data: profile,
    isInitialLoading: isProfileLoading,
    isError: isProfileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: Boolean(authToken),
  });

  const contextValue = useMemo<AppContextValue>(
    () => ({
      isOpenMenu,
      toggleMenu: () => setIsOpenMenu(!isOpenMenu),
      profile,
      refetchProfile: async () => {
        await refetchProfile();
      },
      isProfileLoading,
    }),
    [isOpenMenu, profile, refetchProfile, isProfileLoading],
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
