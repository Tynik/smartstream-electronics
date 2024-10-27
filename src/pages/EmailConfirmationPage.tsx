import React from 'react';
import { useQuery } from '@tanstack/react-query';

import type { NetlifyRequestErrorResponse } from '~/api';
import { netlifyRequest } from '~/api';
import { useQueryParams } from '~/hooks';
import { Alert, Text } from '~/components';

export const EmailConfirmationPage = () => {
  const queryParams = useQueryParams();

  const token = queryParams.get('token');

  const { error } = useQuery<unknown, NetlifyRequestErrorResponse>({
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
