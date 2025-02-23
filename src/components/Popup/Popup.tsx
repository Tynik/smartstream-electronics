import type { HTMLAttributes, ReactNode } from 'react';
import type { UseFloatingOptions } from '@floating-ui/react-dom';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import React, { useState, useEffect } from 'react';
import { flip, shift, useFloating } from '@floating-ui/react-dom';
import { useHoneyLayout, HoneyFlexBox, HoneyLazyContent } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import type { PopupStyledProps } from './PopupStyled';
import { POPUP_TRANSITION_EFFECT_DURATION_MS } from './Popup.constants';
import { PopupStyled } from './PopupStyled';
import { assert } from '~/helpers';

export type PopupChildrenContext = {
  togglePopup: () => void;
};

export type PopupContentContext = {
  closePopup: () => void;
};

export type PopupProps = Omit<PopupStyledProps, 'children' | 'content' | 'isActive'> & {
  children: (context: PopupChildrenContext) => ReactNode;
  content?: ReactNode | ((context: PopupContentContext) => ReactNode);
  contentProps?: HTMLAttributes<HTMLDivElement> & HoneyBoxProps;
  floatingOptions?: Omit<UseFloatingOptions, 'open'>;
  onOpen?: () => void;
};

export const Popup = ({
  children,
  content,
  contentProps,
  floatingOptions,
  onOpen,
  ...props
}: PopupProps) => {
  const { theme } = useHoneyLayout();

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    middleware: [shift({ padding: theme.spacings.base }), flip()],
    ...floatingOptions,
  });

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    }
  }, [isOpen]);

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleDocumentMouseDown = (e: MouseEvent) => {
      const popupElement = refs.reference.current as Nullable<HTMLDivElement>;
      assert(popupElement, 'The `popupElement` must be set');

      if (!popupElement.contains(e.target as Node) && isOpen) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [isOpen]);

  return (
    <PopupStyled
      ref={refs.setReference}
      isActive={isOpen}
      // Data
      data-testid="popup"
      {...props}
    >
      {children({
        togglePopup: () => setIsOpen(!isOpen),
      })}

      <HoneyFlexBox
        ref={refs.setFloating}
        className="popup__content"
        $position={floatingStyles.position}
        $top={floatingStyles.top}
        $left={floatingStyles.left}
        $transform={floatingStyles.transform}
        // Data
        data-testid="popup-content"
        {...contentProps}
      >
        <HoneyLazyContent isMount={isOpen} unmountDelay={POPUP_TRANSITION_EFFECT_DURATION_MS}>
          {typeof content === 'function'
            ? content({
                closePopup,
              })
            : content}
        </HoneyLazyContent>
      </HoneyFlexBox>
    </PopupStyled>
  );
};
