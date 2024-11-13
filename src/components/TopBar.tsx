import React from 'react';
import { HoneyBox } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { PROFILE_QUERY_KEY, PROFILE_ROUTE_PATH, SIGN_IN_ROUTE_PATH } from '~/constants';
import { LogoutIcon, MenuIcon, PersonIcon } from '~/icons';
import { useCurrentApp } from '~/providers';

import { IconButton } from './IconButton';

export const TopBar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { profile, toggleMenu } = useCurrentApp();

  const handleManageProfile = () => {
    navigate(profile ? PROFILE_ROUTE_PATH : SIGN_IN_ROUTE_PATH);
  };

  const handleLogout = async () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    await queryClient.resetQueries({ queryKey: PROFILE_QUERY_KEY });

    navigate(SIGN_IN_ROUTE_PATH);
  };

  return (
    <HoneyBox
      $display="flex"
      $padding="16px"
      $backgroundColor="neutral.charcoalDark"
      $boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
      $zIndex={99}
      // Data
      data-testid="top-bar"
    >
      <IconButton onClick={toggleMenu}>
        <MenuIcon $color="white" />
      </IconButton>

      <HoneyBox $display="flex" $gap={1} $marginLeft="auto">
        <IconButton onClick={handleManageProfile}>
          <PersonIcon $color="white" />
        </IconButton>

        {profile && (
          <IconButton onClick={handleLogout}>
            <LogoutIcon $color="white" />
          </IconButton>
        )}
      </HoneyBox>
    </HoneyBox>
  );
};
