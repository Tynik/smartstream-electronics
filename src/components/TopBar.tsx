import React from 'react';
import { HoneyBox } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';

import { MenuIcon, PersonIcon } from '~/icons';
import { useCurrentApp } from '~/providers';

import { IconButton } from './IconButton';

export const TopBar = () => {
  const navigate = useNavigate();

  const { toggleMenu } = useCurrentApp();

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

      <IconButton onClick={() => navigate('sign-in')} $marginLeft="auto">
        <PersonIcon $color="white" />
      </IconButton>
    </HoneyBox>
  );
};
