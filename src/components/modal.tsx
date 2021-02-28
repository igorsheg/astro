import { Cross2Icon } from '@radix-ui/react-icons';
import { invert, transparentize } from 'polished';
import { FC, ReactNode, ReactText, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { Dialog, DialogBackdrop, useDialogState } from 'reakit/Dialog';
import styled, { css } from 'styled-components';
import Button from './button';
import Padder from './padder';
import Tooltip from './tooltip';

interface ModalProps {
  title: ReactText | ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
}
const Modal: FC<ModalProps> = ({ isOpen, title, onRequestClose, children }) => {
  const dialog = useDialogState({ animated: true });

  const blanketAnimation = useSpring({
    opacity: dialog.visible ? 1 : 0,
    transform: dialog.visible
      ? 'translateY(0px) scale(1)'
      : 'translateY(15px) scale(1)',
    config: { tension: 300, friction: 30, velocity: 20 },
  });

  useEffect(() => {
    dialog.setVisible(isOpen);
  }, [isOpen]);

  return (
    <>
      <Blanket {...dialog}>
        <StyledModal
          hideOnClickOutside={false}
          style={blanketAnimation}
          aria-label={`${title} Modal`}
          {...dialog}
        >
          <Header>
            <Tooltip tabIndex={-1} label="Close modal">
              <Button
                style={{ width: '30px', padding: 0 }}
                tabIndex={-1}
                hierarchy="ternary"
                onClick={onRequestClose}
                type="button"
              >
                <Cross2Icon />
              </Button>
            </Tooltip>
            <h1>{title}</h1>
            <Padder x={30} />
          </Header>
          <Body>{children}</Body>
        </StyledModal>
      </Blanket>
    </>
  );
};

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 1px 2px 0px ${p => transparentize(0.95, p.theme.text.primary)},
    0 0 0 1px ${p => p.theme.border.primary} inset;
`;

const darkStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;
`;

const Blanket = styled(DialogBackdrop)`
  width: 100vw;
  height: 100vh;
  /* z-index: 991; */
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${transparentize(0.5, 'black')};
  opacity: 0;
  transition: opacity 240ms cubic-bezier(0.19, 1, 0.22, 1);

  &[data-enter] {
    opacity: 1;
  }

  /* backdrop-filter: saturate(180%) blur(20px); */
`;

const StyledModal = styled(animated(Dialog))`
  width: 600px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  max-height: calc(100vh - 96px);
  display: flex;
  ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};
`;

const Header = styled.div`
  height: 60px;
  min-height: 60px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 -1px 0 0 ${p => p.theme.border.primary};

  h1 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    padding: 0;
  }
`;

const Body = styled.div`
  display: flex;
  position: relative;
  /* height: 100vh; */
  overflow-y: auto;
  flex-direction: column;
  padding: 18px;
`;

export default Modal;
