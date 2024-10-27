import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyBox } from '@react-hive/honey-layout';

import type { NetlifyRequestErrorResponse } from '~/api';
import { useQueryParams } from '~/hooks';
import { netlifyRequest } from '~/api';
import { Text } from '~/components';

export const SignUpConfirmationPage = () => {
  const queryParams = useQueryParams();

  const confirmationToken = queryParams.get('token');

  const { error } = useQuery<unknown, NetlifyRequestErrorResponse>({
    queryKey: ['confirm-account'],
    queryFn: () =>
      netlifyRequest('confirm-account', {
        method: 'POST',
        params: {
          confirmationToken: confirmationToken!,
        },
      }),
    enabled: Boolean(confirmationToken),
  });

  return (
    <>
      {error && (
        <HoneyBox
          $padding={2}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="error.redLight"
          $backgroundColor="error.pinkLight"
        >
          <Text variant="body2">{error.data.error}</Text>
        </HoneyBox>
      )}
    </>
  );
};
