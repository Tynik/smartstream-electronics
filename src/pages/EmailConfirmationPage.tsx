import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { NetlifyRequestErrorResponse, NetlifyRequestResponse } from '~/api';
import { netlifyRequest } from '~/api';
import { useQueryParams } from '~/hooks';
import { Alert, Text } from '~/components';
import { SIGN_IN_ROUTE_PATH } from '~/constants';

export const EmailConfirmationPage = () => {
  const navigate = useNavigate();

  const queryParams = useQueryParams();

  const token = queryParams.get('token');

  const { data, error } = useQuery<NetlifyRequestResponse, NetlifyRequestErrorResponse>({
    queryKey: ['confirm-account'],
    queryFn: () =>
      netlifyRequest('confirm-email', {
        method: 'POST',
        params: {
          token: token!,
        },
      }),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (data?.status === 'ok') {
      navigate(SIGN_IN_ROUTE_PATH);
    }
  }, [data]);

  return (
    <>
      {error && (
        <Alert>
          <Text variant="body2">{error.data.error}</Text>
        </Alert>
      )}
    </>
  );
};
