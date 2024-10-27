import React from 'react';
import { HoneyBox } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';

import { SIGN_IN_ROUTE_PATH } from '~/constants';
import { LogoutIcon, MenuIcon, PersonIcon } from '~/icons';
import { useCurrentApp } from '~/providers';

import { IconButton } from './IconButton';

export const TopBar = () => {
  const navigate = useNavigate();

  const { accountProfile, toggleMenu } = useCurrentApp();

  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

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

      <HoneyBox $marginLeft="auto">
        {accountProfile ? (
          <IconButton onClick={handleLogout}>
            <LogoutIcon $color="white" />
          </IconButton>
        ) : (
          <IconButton onClick={() => navigate(SIGN_IN_ROUTE_PATH)}>
            <PersonIcon $color="white" />
          </IconButton>
        )}
      </HoneyBox>
    </HoneyBox>
  );
};
