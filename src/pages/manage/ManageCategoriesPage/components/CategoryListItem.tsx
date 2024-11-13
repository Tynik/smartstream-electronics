import { HoneyBox } from '@react-hive/honey-layout';
import React from 'react';
import styled, { css } from 'styled-components';

import type { Category } from '~/api';
import { IconButton, Text } from '~/components';
import { EditIcon } from '~/icons';

const CategoryListItemStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    cursor: pointer;

    &:hover {
      background-color: ${colors.secondary.extraLightGray};
    }
  `}
`;

CategoryListItemStyled.defaultProps = {
  $display: 'flex',
  $gap: 1,
  $padding: 1,
  $alignItems: 'center',
};

type CategoryListItemProps = {
  category: Category;
  onEdit: (category: Category) => void;
};

export const CategoryListItem = ({ category, onEdit }: CategoryListItemProps) => {
  return (
    <CategoryListItemStyled>
      <Text variant="subtitle2">{category.name}</Text>

      <IconButton
        onClick={e => {
          e.stopPropagation();

          onEdit(category);
        }}
        $marginLeft="auto"
      >
        <EditIcon $color="neutral.charcoalGray" $size="small" />
      </IconButton>
    </CategoryListItemStyled>
  );
};
