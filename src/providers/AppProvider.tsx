import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import type { Profile, NetlifyRequestResponse } from '~/api';
import { PROFILE_QUERY_KEY, SIGN_IN_ROUTE_PATH } from '~/constants';
import { assert, getCookieValue } from '~/helpers';
import { getProfile, netlifyRequest } from '~/api';

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
  const location = useLocation();

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
          const redirectPath = encodeURIComponent(location.pathname + location.search);

          navigate(`${SIGN_IN_ROUTE_PATH}?redirect=${redirectPath}`);

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
      isProfileLoading,
      refetchProfile: async () => {
        await refetchProfile();
      },
    }),
    [isOpenMenu, profile, isProfileLoading, refetchProfile],
  );

  return <AppContext.Provider value={contextValue}>{children(contextValue)}</AppContext.Provider>;
};

export const useCurrentApp = () => {
  const context = useContext(AppContext);
  assert(context, 'Could not find current App context');

  return context;
};
