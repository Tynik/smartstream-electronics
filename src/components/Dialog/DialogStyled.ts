import styled, { css } from 'styled-components';
import { resolveColor, resolveFont, resolveSpacing } from '@react-hive/honey-layout';

export const DIALOG_TRANSITION_DURATION_MS = 250;

const TOP_PERCENTAGE = '25%';

export type DialogStyledProps = {
  isOpen: boolean;
};

export const DialogStyled = styled.div<DialogStyledProps>`
  ${({ isOpen, theme: { colors } }) => css`
    position: absolute;

    opacity: ${isOpen ? 1 : 0};
    visibility: ${isOpen ? 'visible' : 'hidden'};

    transition-property: opacity, visibility;
    transition-duration: ${DIALOG_TRANSITION_DURATION_MS}ms;
    transition-timing-function: ease-in-out;

    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    z-index: 999;

    > .dialog__backdrop {
      width: 100%;
      height: 100%;

      background-color: ${resolveColor('neutral.charcoalGray', 0.7)};
    }

    > .dialog__body {
      position: absolute;

      display: flex;
      flex-direction: column;

      max-width: 1200px;
      max-height: calc(100% - ${TOP_PERCENTAGE} - 24px);

      left: 50%;
      top: ${TOP_PERCENTAGE};

      transform: translateX(-50%);
      background-color: white;

      border-radius: 8px;
      border: 1px solid ${colors.secondary.lightGray};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      overflow: hidden;

      > .dialog__title {
        ${resolveFont('subtitle1')}

        position: relative;

        padding: ${resolveSpacing(2)};

        &:after {
          position: absolute;
          content: ' ';

          display: block;
          left: 0;
          bottom: 0;
          width: 100%;

          border-bottom: 1px solid ${colors.secondary.softGray};
        }
      }

      > .dialog__content {
        padding: ${resolveSpacing(2)};

        overflow-y: auto;
      }
    }
  `}
`;