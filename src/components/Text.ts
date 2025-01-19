import styled, { css } from 'styled-components';
import type { HTMLAttributes } from 'react';
import type { HoneyBoxProps, HoneyFonts } from '@react-hive/honey-layout';
import { resolveFont, HoneyBox } from '@react-hive/honey-layout';

export type TextProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
    variant: keyof HoneyFonts;
  };

export const Text = styled(HoneyBox).attrs<TextProps>(({ as, $color }) => ({
  as: as ?? 'p',
  $color: $color ?? 'neutral.darkGray',
}))<TextProps>`
  ${({ variant }) => css`
    ${resolveFont(variant)};
  `}
`;
