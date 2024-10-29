import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { bpMedia, resolveSpacing, useHoneyLayout } from '@react-hive/honey-layout';

import { MANAGE_FEATURES_ROUTE_PATH, MANAGE_PRODUCTS_ROUTE_PATH } from '~/constants';
import { useCurrentApp } from '~/providers';

export const MENU_WIDTH = '300px';

type MenuStyledProps = {
  isOpenMenu: boolean;
};

const MenuStyled = styled.div<MenuStyledProps>`
  ${({ isOpenMenu, theme }) => css`
    position: relative;

    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    height: 100%;

    transition: all 200ms ease-in-out;
    background-color: ${theme.colors.neutral.charcoalGray};
    overflow: hidden auto;

    ${isOpenMenu
      ? css`
          width: ${MENU_WIDTH};
          padding: 16px;
        `
      : css`
          width: 0;
          padding: 0;
        `}

    ${bpMedia('xs').down} {
      width: ${isOpenMenu && '100%'};
    }

    ${bpMedia('xs').up} {
      border-right: 1px solid ${theme.colors.neutral.charcoalDark};
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2); /* Right-side shadow */
    }

    ${bpMedia('sm').down} {
      position: absolute;
      z-index: 999;
    }
  `}
`;

const List = styled.ul`
  width: 100%;

  margin: 0;
  padding: 0;

  list-style-type: none;
  overflow: hidden;
`;

const ListItem = styled.li`
  ${({ theme: { colors } }) => css`
    margin: ${resolveSpacing([0.5, 0])};

    font-size: 18px;
    border-radius: 4px;
    color: #ffffff;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    a {
      display: block;

      width: 100%;
      padding: 8px 16px;

      &.active {
        background-color: ${colors.neutral.charcoalDark};
      }
    }

    &:hover {
      background-color: ${colors.neutral.charcoalDark};
    }
  `}
`;

type MenuItem = {
  id: string;
  title: string;
  to: string;
  isVisible?: boolean;
};

export const Menu = () => {
  const { screenState } = useHoneyLayout();

  const { accountProfile, isOpenMenu, toggleMenu } = useCurrentApp();

  const handleOnClickMenuItem = () => {
    if (screenState.isXs || screenState.isSm) {
      toggleMenu();
    }
  };

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: 'manage-products',
        title: 'Products',
        to: MANAGE_PRODUCTS_ROUTE_PATH,
        isVisible: accountProfile?.role === 'admin',
      },
      {
        id: 'manage-features',
        title: 'Features',
        to: MANAGE_FEATURES_ROUTE_PATH,
        isVisible: accountProfile?.role === 'admin',
      },
    ],
    [accountProfile],
  );

  return (
    <MenuStyled isOpenMenu={isOpenMenu}>
      <List>
        {menuItems.map(
          item =>
            item.isVisible !== false && (
              <ListItem key={item.id}>
                <NavLink onClick={handleOnClickMenuItem} to={item.to}>
                  {item.title}
                </NavLink>
              </ListItem>
            ),
        )}
      </List>
    </MenuStyled>
  );
};
