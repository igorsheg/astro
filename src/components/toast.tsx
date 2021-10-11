import { CheckIcon } from '@radix-ui/react-icons';
import { invert, transparentize } from 'polished';
import { FC } from 'react';
import { useToaster } from 'react-hot-toast';
import styled, { css } from 'styled-components';
import Card from './card';

const DEFAULT_OFFSET = 16;

const AstroToast: FC = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  return (
    <div
      style={{
        position: 'fixed',
        top: DEFAULT_OFFSET,
        left: DEFAULT_OFFSET,
        right: DEFAULT_OFFSET,
        bottom: DEFAULT_OFFSET,
        pointerEvents: 'none',
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map(toast => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
          gutter: 8,
        });
        const ref = (el: HTMLDivElement) => {
          if (el && !toast.height) {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };

        return (
          <StyledToast
            key={toast.id}
            ref={ref}
            style={{
              transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${offset * -1}px)`,
            }}
            {...toast.ariaProps}
          >
            {toast.type === 'success' && <CheckIcon className="toastPrefix" />}
            {toast.message}
          </StyledToast>
        );
      })}
    </div>
  );
};

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 40px 64px 0 rgba(65, 78, 101, 0.1),
    0 24px 32px 0 rgba(65, 78, 101, 0.1), 0 16px 16px 0 rgba(65, 78, 101, 0.1),
    0 8px 8px 0 rgba(65, 78, 101, 0.1), 0 4px 4px 0 rgba(65, 78, 101, 0.1),
    0 2px 2px 0 rgba(65, 78, 101, 0.1);
`;

const darkStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset,
    0 40px 64px 0 rgba(0, 0, 0, 0.2), 0 24px 32px 0 rgba(0, 0, 0, 0.2),
    0 16px 16px 0 rgba(0, 0, 0, 0.2), 0 8px 8px 0 rgba(0, 0, 0, 0.2),
    0 4px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.2);
`;

const StyledToast = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 12px 18px;
  border-radius: 4px;
  max-width: 420px;
  backdrop-filter: saturate(180%) blur(20px);
  align-items: center;
  justify-content: center;
  display: flex;
  line-height: 18px;
  font-size: 14px;
  color: ${p => p.theme.text.primary};
  font-weight: 500;
  ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};

  strong {
    font-weight: 600;
  }
  .toastPrefix {
    color: rgb(48, 209, 88);
    width: 24px;
    height: 24px;
    margin: 0 6px 0 0;
  }

  p {
    padding: 0;
    margin: 0;
    line-height: 18px;
    font-size: 14px;
    color: ${p => p.theme.text.primary};
  }
`;

export { AstroToast };
