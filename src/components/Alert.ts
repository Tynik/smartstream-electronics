import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { resolveFont, HoneyFlexBox } from '@react-hive/honey-layout';
import styled, { css } from 'styled-components';

type AlertVariant = 'error' | 'info' | 'success' | 'warning';

const variantMap: Record<AlertVariant, HoneyBoxProps> = {
  error: {
    $borderColor: 'error.redLight',
    $backgroundColor: 'error.pinkLight',
  },
  info: {
    $borderColor: 'primary.skyBlue',
    $backgroundColor: 'primary.aliceBlue',
  },
  success: {
    $borderColor: 'error.redLight',
    $backgroundColor: 'error.pinkLight',
  },
  warning: {
    $borderColor: 'error.redLight',
    $backgroundColor: 'error.pinkLight',
  },
};

type AlertProps = HoneyBoxProps & {
  variant?: AlertVariant;
};

export const Alert = styled(HoneyFlexBox).attrs<AlertProps>(
  ({ variant = 'info' }) => variantMap[variant],
)<AlertProps>`
  ${() => css`
    ${resolveFont('body2')}
  `}
`;

Alert.defaultProps = {
  $padding: 2,
  $borderRadius: '4px',
  $border: '1px solid',
};
