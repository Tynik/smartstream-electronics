import React, { useEffect, useRef } from 'react';

import { HoneyBox } from '@react-hive/honey-layout';
import { Route, Routes, useLocation } from 'react-router-dom';

import type { Nullable } from '~/types';
import { AppProvider } from '~/providers';
import { Container, Menu, TopBar } from '~/components';
import { SignInPage, SignUpPage } from '~/pages';

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
      <TopBar />

      <HoneyBox
        $position="relative"
        $display="flex"
        $height="100%"
        $alignItems="flex-start"
        $overflow="hidden"
      >
        <Menu />

        <HoneyBox ref={contentRef} $display="flex" $flexGrow={1} $height="100%" $overflow="auto">
          <Container>
            <Routes>
              <Route path="sign-up" element={<SignUpPage />} />
              <Route path="sign-in" element={<SignInPage />} />
            </Routes>
          </Container>
        </HoneyBox>
      </HoneyBox>
    </AppProvider>
  );
};
