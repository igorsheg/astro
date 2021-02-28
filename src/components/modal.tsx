import {
  useDialogState,
  Dialog,
  DialogDisclosure,
  DialogBackdrop,
} from 'reakit/Dialog';
import { FC, ReactNode, ReactText, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { invert, transparentize } from 'polished';
import { useSpring, animated } from 'react-spring';
import { Cross1Icon } from '@radix-ui/react-icons';
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
    config: { tension: 400, friction: 30, velocity: 20 },
  });

  useEffect(() => {
    dialog.setVisible(isOpen);
  }, [isOpen]);

  return (
    <>
      {/* <DialogDisclosure {...dialog}>Open dialog</DialogDisclosure> */}
      <Blanket {...dialog}>
        <StyledModal
          hideOnClickOutside={false}
          style={blanketAnimation}
          {...dialog}
          aria-label="Welcome"
        >
          <Header>
            <h1>{title}</h1>
            <Tooltip label="Close modal">
              <button onClick={onRequestClose} type="button">
                <Cross1Icon />
              </button>
            </Tooltip>
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
  background: ${p => transparentize(0.5, 'black')};
  opacity: 0;
  transition: opacity 240ms cubic-bezier(0.19, 1, 0.22, 1);

  &[data-enter] {
    opacity: 1;
  }

  backdrop-filter: saturate(180%) blur(20px);
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
  height: 72px;
  min-height: 72px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    border: none;
    background: none;
    height: 30px;
    padding: 0;
    margin: 0;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => p.theme.text.primary};

    :hover {
      cursor: pointer;
      color: ${p => p.theme.text.secondary};
    }
  }
  h1 {
    font-size: 18px;
    margin: 0;
    padding: 0;
  }
`;

const Body = styled.div`
  display: flex;
  position: relative;
  height: 100vh;
  overflow-y: auto;
  flex-direction: column;
`;

export default Modal;
