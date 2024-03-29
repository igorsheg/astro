import { invert, transparentize } from 'polished';
import * as React from 'react';
import { FC, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import { Menu, MenuOptions } from 'reakit/Menu';
import styled, { css } from 'styled-components';

interface Props extends MenuOptions {
  visible?: boolean;
}

const ContextMenu: FC<Props> = ({ children, ...rest }) => {
  const animationOrigin =
    rest.placement === 'bottom-start' || 'right-start' ? 'right' : 'left';

  function tpmt(x: number) {
    return (Math.pow(2, -10 * x) - 0.0009765625) * 1.0009775171065494;
  }

  const [animationProps, setAnimation] = useSpring(() => ({
    opacity: 0,
    transform: 'translateY(-2px)',
    transformOrigin: `${animationOrigin} 0px`,
    config: {
      duration: 240,
      easing: (t: number) => 1 - tpmt(t),
    },
  }));

  useEffect(() => {
    setAnimation({
      opacity: rest.visible ? 1 : 0,
      transform: `translateY(${rest.visible ? '0px' : '-2px'})`,
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
  z-index: 999999999999991;
`;

const lightStyles = css`
  background: ${p => p.theme.background.primary};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0.1) 0px 4px 8px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px;
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
  min-width: 144px;
  max-height: 75vh;
  max-width: 276px;
  pointer-events: all;
  font-weight: normal;
  @media print {
    display: none;
  }
`;

export default ContextMenu;
