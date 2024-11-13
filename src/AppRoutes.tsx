import { Navigate, Route, Routes } from 'react-router-dom';
import React from 'react';

import { PROFILE_ROUTE_PATH, SIGN_IN_ROUTE_PATH, SIGN_UP_ROUTE_PATH } from '~/constants';
import {
  AddProductPage,
  ManageCategoriesPage,
  EmailConfirmationPage,
  ManageFeaturesPage,
  ManageProductsPage,
  ProfilePage,
  SignInPage,
  SignUpPage,
} from '~/pages';
import { useCurrentApp } from '~/providers';
import { Loading } from '~/components';

export const AppRoutes = () => {
  const { profile, isProfileLoading } = useCurrentApp();

  if (isProfileLoading) {
    return <Loading $margin="auto" />;
  }

  return (
    <Routes>
      {profile ? (
        <>
          <Route path={PROFILE_ROUTE_PATH} element={<ProfilePage />} />

          {profile.role === 'admin' && (
            <Route path="/manage/*">
              <Route path="categories" element={<ManageCategoriesPage />} />
              <Route path="products" element={<ManageProductsPage />} />
              <Route path="features" element={<ManageFeaturesPage />} />
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
