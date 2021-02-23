import { invert, transparentize } from 'polished';
import * as React from 'react';
import { FC } from 'react';
import { animated, useSpring } from 'react-spring';
import { Menu } from 'reakit/Menu';
import styled, { css } from 'styled-components';

type Props = {
  'aria-label': string;
  visible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const ContextMenu: FC<Props> = ({ children, onOpen, onClose, ...rest }) => {
  const [animationProps, setAnimation] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(2px)',
    config: { tension: 500, friction: 30 },
  }));

  React.useEffect(() => {
    setAnimation({
      opacity: rest.visible ? 1 : 0,
      transform: `translateY(${rest.visible ? '0' : '2px'})`,
    });
  }, [rest.visible]);

  return (
    <Menu {...rest}>
      {props => (
        <Position {...props}>
          <Background style={animationProps}>{children}</Background>
        </Position>
      )}
    </Menu>
  );
};

const Position = styled(animated.div)`
  position: absolute;
`;

const lightStyles = css`
  background: ${p => p.theme.background.secondary};
  box-shadow: 0 1px 2px 0px ${p => transparentize(0.95, p.theme.text.primary)},
    0 0 0 1px ${p => p.theme.border.primary} inset;
`;

const darkStyles = css`
  background: ${p => p.theme.background.secondary};
  box-shadow: 0 0 0 1px ${p => invert(p.theme.text.primary)},
    0 0 0 1px ${p => transparentize(0, p.theme.border.primary)} inset;
`;
const Background = styled(animated.div)`
  ${p => (p.theme.id === 'dark' ? darkStyles : lightStyles)};
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 6px;
  padding: 6px;
  min-width: 180px;
  overflow: hidden;
  overflow-y: auto;
  max-height: 75vh;
  max-width: 276px;
  pointer-events: all;
  font-weight: normal;
  @media print {
    display: none;
  }
`;

export default ContextMenu;
