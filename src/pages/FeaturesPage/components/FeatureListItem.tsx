import { HoneyBox } from '@react-hive/honey-layout';
import React from 'react';

import type { Feature } from '~/api';
import { IconButton, Text } from '~/components';
import { EditIcon } from '~/icons';

type FeatureListItemProps = {
  feature: Feature;
  onEdit: (feature: Feature) => void;
};

export const FeatureListItem = ({ feature, onEdit }: FeatureListItemProps) => {
  return (
    <HoneyBox $display="flex" $gap={1} $padding={1} $alignItems="center">
      <Text variant="subtitle2">{feature.name}</Text>

      <IconButton onClick={() => onEdit(feature)} $marginLeft="auto">
        <EditIcon $color="neutral.charcoalGray" $size="small" />
      </IconButton>
    </HoneyBox>
  );
};
