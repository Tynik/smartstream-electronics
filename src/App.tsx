import React, { useEffect, useRef } from 'react';

import { HoneyBox } from '@react-hive/honey-layout';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import type { Nullable } from '~/types';
import { SIGN_IN_ROUTE_PATH, SIGN_UP_ROUTE_PATH } from '~/constants';
import { AppProvider } from '~/providers';
import { Container, Menu, MENU_WIDTH, TopBar } from '~/components';
import { SignInPage, SignUpConfirmationPage, SignUpPage } from '~/pages';

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
                <Routes>
                  <Route path={SIGN_UP_ROUTE_PATH} element={<SignUpPage />} />
                  <Route path={SIGN_IN_ROUTE_PATH} element={<SignInPage />} />
                  <Route path="/account/confirm" element={<SignUpConfirmationPage />} />
                </Routes>
              </Container>
            </HoneyBox>
          </HoneyBox>
        </>
      )}
    </AppProvider>
  );
};
