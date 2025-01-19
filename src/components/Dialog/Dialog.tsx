import type { ReactNode } from 'react';
import React from 'react';
import { createPortal } from 'react-dom';
import { HoneyLazyContent } from '@react-hive/honey-layout';

import { DialogStyled } from './DialogStyled';

const DIALOG_TRANSITION_DURATION_MS = 250;

type ChildrenContext = {
  closeDialog: () => void;
};

export type DialogProps = {
  children: ReactNode | ((context: ChildrenContext) => ReactNode);
  isOpen: boolean;
  title: string;
  onClose: () => void;
};

export const Dialog = ({ children, isOpen, title, onClose, ...props }: DialogProps) => {
  return createPortal(
    <DialogStyled
      isActive={isOpen}
      onDeactivate={onClose}
      role="dialog"
      aria-labelledby="dialog-title"
      {...props}
    >
      {({ deactivateOverlay }) => (
        <>
          <div onClick={deactivateOverlay} className="dialog__backdrop" />

          <div className="dialog__body">
            <div id="dialog-title" className="dialog__title">
              {title}
            </div>

            <div className="dialog__content">
              <HoneyLazyContent isMount={isOpen} unmountDelay={DIALOG_TRANSITION_DURATION_MS}>
                {typeof children === 'function'
                  ? children({
                      closeDialog: deactivateOverlay,
                    })
                  : children}
              </HoneyLazyContent>
            </div>
          </div>
        </>
      )}
    </DialogStyled>,
    document.body,
  );
};
