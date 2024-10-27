import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';

import {
  ADD_PRODUCT_ROUTE_PATH,
  PRODUCTS_ROUTE_PATH,
  PROFILE_ROUTE_PATH,
  SIGN_IN_ROUTE_PATH,
  SIGN_UP_ROUTE_PATH,
} from '~/constants';
import {
  AddProductPage,
  EmailConfirmationPage,
  ProductsPage,
  ProfilePage,
  SignInPage,
  SignUpPage,
} from '~/pages';
import { useCurrentApp } from '~/providers';
import { Loading } from '~/components';

export const AppRoutes = () => {
  const { accountProfile, isAccountProfileLoading } = useCurrentApp();

  if (isAccountProfileLoading) {
    return <Loading $margin="auto" />;
  }

  return (
    <Routes>
      {accountProfile ? (
        <>
          <Route path={PROFILE_ROUTE_PATH} element={<ProfilePage />} />

          {accountProfile.role === 'admin' && (
            <>
              <Route path={PRODUCTS_ROUTE_PATH} element={<ProductsPage />} />
              <Route path={ADD_PRODUCT_ROUTE_PATH} element={<AddProductPage />} />
            </>
          )}
        </>
      ) : (
        <>
          <Route path={SIGN_UP_ROUTE_PATH} element={<SignUpPage />} />
          <Route path={SIGN_IN_ROUTE_PATH} element={<SignInPage />} />
          <Route path="/email/confirm" element={<EmailConfirmationPage />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
