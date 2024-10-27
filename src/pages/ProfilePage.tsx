import React from 'react';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

import { useCurrentApp } from '~/providers';
import { Panel, Text } from '~/components';

export const ProfilePage = () => {
  const { accountProfile } = useCurrentApp();

  return (
    <Panel title="Profile">
      {accountProfile && (
        <HoneyFlexBox $gap={1}>
          <HoneyBox $display="flex" $gap={2}>
            <Text variant="body2" $width="100%" $maxWidth="120px">
              First Name
            </Text>
            <Text variant="body2">{accountProfile.firstName}</Text>
          </HoneyBox>

          <HoneyBox $display="flex" $gap={2}>
            <Text variant="body2" $width="100%" $maxWidth="120px">
              Last Name
            </Text>
            <Text variant="body2">{accountProfile.lastName}</Text>
          </HoneyBox>

          <HoneyBox $display="flex" $gap={2}>
            <Text variant="body2" $width="100%" $maxWidth="120px">
              Email
            </Text>
            <Text variant="body2">{accountProfile.email}</Text>
          </HoneyBox>

          <HoneyBox $display="flex" $gap={2}>
            <Text variant="body2" $width="100%" $maxWidth="120px">
              Phone
            </Text>
            <Text variant="body2">{accountProfile.phone || '-'}</Text>
          </HoneyBox>
        </HoneyFlexBox>
      )}
    </Panel>
  );
};
