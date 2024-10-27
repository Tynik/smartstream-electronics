import styled, { css } from 'styled-components';
import type { HTMLAttributes } from 'react';
import type { HoneyBoxProps, HoneyFonts } from '@react-hive/honey-layout';
import { resolveFont, HoneyBox } from '@react-hive/honey-layout';

type ButtonProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
    variant: keyof HoneyFonts;
  };

export const Text = styled(HoneyBox).attrs<ButtonProps>(({ as }) => ({
  as: as ?? 'p',
}))<ButtonProps>`
  ${({ variant }) => css`
    ${resolveFont(variant)}
  `}
`;
