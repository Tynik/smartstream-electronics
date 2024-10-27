import React, { useEffect, useRef } from 'react';

import { HoneyBox } from '@react-hive/honey-layout';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import type { Nullable } from '~/types';
import { AppProvider } from '~/providers';
import { Container, Menu, MENU_WIDTH, TopBar } from '~/components';
import { AppRoutes } from '~/AppRoutes';

export const App = () => {
  const location = useLocation();

  const contentRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <AppProvider>
      {({ isOpenMenu }) => (
        <>
          <TopBar />

          <ToastContainer
            position="bottom-center"
            style={{
              transform: `translateX(calc(-50% + ${isOpenMenu ? `${MENU_WIDTH} / 2` : 0}))`,
            }}
          />

          <HoneyBox
            $position="relative"
            $display="flex"
            $height="100%"
            $alignItems="flex-start"
            $overflow="hidden"
            $backgroundColor="secondary.lightestGray"
          >
            <Menu />

            <HoneyBox
              ref={contentRef}
              $display="flex"
              $flexGrow={1}
              $height="100%"
              $overflow="auto"
            >
              <Container>
                <AppRoutes />
              </Container>
            </HoneyBox>
          </HoneyBox>
        </>
      )}
    </AppProvider>
  );
};
