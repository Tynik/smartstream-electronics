import type { HTMLAttributes } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import styled, { css } from 'styled-components';
import { HoneyFlexBox, honeyVisibilityTransitionEffect } from '@react-hive/honey-layout';

import { POPUP_TRANSITION_EFFECT_DURATION_MS } from './Popup.constants';

export type PopupStyledProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
    isActive: boolean;
  };

export const PopupStyled = styled(HoneyFlexBox)<PopupStyledProps>`
  ${() => css`
    position: relative;

    > .popup__content {
      ${honeyVisibilityTransitionEffect({
        durationMs: POPUP_TRANSITION_EFFECT_DURATION_MS,
      })};
    }
  `}
`;
