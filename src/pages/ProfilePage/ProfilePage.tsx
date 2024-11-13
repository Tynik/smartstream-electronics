import React, { useState } from 'react';
import { HoneyBox, HoneyFlexBox, HoneyList } from '@react-hive/honey-layout';

import { useCurrentApp } from '~/providers';
import { IconButton, Panel, Text } from '~/components';
import { EditIcon } from '~/icons';
import { EditProfileDialog } from './dialogs';

export const ProfilePage = () => {
  const { profile } = useCurrentApp();

  const [isEditProfile, setIsEditProfile] = useState(false);

  return (
    <HoneyFlexBox $gap={2}>
      <Panel title="Profile">
        {profile && (
          <HoneyBox $display="flex" $gap={2} $alignItems="flex-start">
            <HoneyFlexBox $gap={1} $width="100%">
              <HoneyBox $display="flex" $gap={2}>
                <Text variant="body2" $width="100%" $maxWidth="120px">
                  First Name
                </Text>
                <Text variant="body2">{profile.firstName}</Text>
              </HoneyBox>

              <HoneyBox $display="flex" $gap={2}>
                <Text variant="body2" $width="100%" $maxWidth="120px">
                  Last Name
                </Text>
                <Text variant="body2">{profile.lastName}</Text>
              </HoneyBox>

              <HoneyBox $display="flex" $gap={2}>
                <Text variant="body2" $width="100%" $maxWidth="120px">
                  Email
                </Text>
                <Text variant="body2">{profile.email}</Text>
              </HoneyBox>

              <HoneyBox $display="flex" $gap={2}>
                <Text variant="body2" $width="100%" $maxWidth="120px">
                  Phone
                </Text>
                <Text variant="body2">{profile.phone || '-'}</Text>
              </HoneyBox>
            </HoneyFlexBox>

            <IconButton onClick={() => setIsEditProfile(true)}>
              <EditIcon $color="neutral.charcoalGray" />
            </IconButton>

            <EditProfileDialog isOpen={isEditProfile} onClose={() => setIsEditProfile(false)} />
          </HoneyBox>
        )}
      </Panel>

      <Panel title="Shipping Addesses">
        <HoneyList items={profile?.shippingAddresses} noContent="Not set">
          {shippingAddress => <Text variant="body2">{shippingAddress.line1}</Text>}
        </HoneyList>
      </Panel>

      <Panel title="Billing Addesses">
        <HoneyList items={profile?.billingAddresses} noContent="Not set">
          {billingAddress => <Text variant="body2">{billingAddress.line1}</Text>}
        </HoneyList>
      </Panel>
    </HoneyFlexBox>
  );
};
