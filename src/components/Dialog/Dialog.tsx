import type { ReactNode } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { HoneyLazyContent } from '@react-hive/honey-layout';

import type { DialogStyledProps } from './DialogStyled';
import { DIALOG_TRANSITION_DURATION_MS, DialogStyled } from './DialogStyled';

type ChildrenContext = {
  closeDialog: () => void;
};

export type DialogProps = DialogStyledProps & {
  children: ReactNode | ((context: ChildrenContext) => ReactNode);
  title: string;
  onClose: () => void;
};

export const Dialog = ({ children, title, onClose, ...props }: DialogProps) => {
  return createPortal(
    <DialogStyled {...props}>
      <div onClick={onClose} className="dialog__backdrop" />

      <div className="dialog__body">
        <div className="dialog__title">{title}</div>

        <div className="dialog__content">
          <HoneyLazyContent isMount={props.isOpen} unmountDelay={DIALOG_TRANSITION_DURATION_MS}>
            {typeof children === 'function'
              ? children({
                  closeDialog: onClose,
                })
              : children}
          </HoneyLazyContent>
        </div>
      </div>
    </DialogStyled>,
    document.body,
  );
};
