import { HoneyBox } from '@react-hive/honey-layout';
import React from 'react';
import styled, { css } from 'styled-components';

import type { FeatureCategory } from '~/api';
import { IconButton, Text } from '~/components';
import { EditIcon } from '~/icons';
import { Nullable } from '~/types';

const FeatureCategoryListItemStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    cursor: pointer;

    &:hover {
      background-color: ${colors.secondary.extraLightGray};
    }

    &[aria-selected='true'] {
      background-color: ${colors.secondary.lightGray};
    }
  `}
`;

FeatureCategoryListItemStyled.defaultProps = {
  $display: 'flex',
  $gap: 1,
  $padding: 1,
  $alignItems: 'center',
};

type ManageFeatureCategoryListItemProps = {
  featureCategory: FeatureCategory;
  isSelected: boolean;
  onSelect: (featureCategory: Nullable<FeatureCategory>) => void;
  onEdit: (featureCategory: FeatureCategory) => void;
};

export const ManageFeatureCategoryListItem = ({
  featureCategory,
  isSelected,
  onSelect,
  onEdit,
}: ManageFeatureCategoryListItemProps) => {
  return (
    <FeatureCategoryListItemStyled
      onClick={() => onSelect(isSelected ? null : featureCategory)}
      aria-selected={isSelected}
    >
      <Text variant="subtitle2">{featureCategory.name}</Text>

      <IconButton
        onClick={e => {
          e.stopPropagation();

          onEdit(featureCategory);
        }}
        $marginLeft="auto"
      >
        <EditIcon $color="neutral.charcoalGray" $size="small" />
      </IconButton>
    </FeatureCategoryListItemStyled>
  );
};
