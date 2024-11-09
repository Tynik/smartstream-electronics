import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';

import { PROFILE_ROUTE_PATH, SIGN_IN_ROUTE_PATH, SIGN_UP_ROUTE_PATH } from '~/constants';
import {
  AddProductPage,
  CategoriesPage,
  EmailConfirmationPage,
  FeaturesPage,
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
            <Route path="/manage/*">
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="features" element={<FeaturesPage />} />
              <Route path="products/add" element={<AddProductPage />} />
            </Route>
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
