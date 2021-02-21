import React, { FC, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import styled, { keyframes } from 'styled-components';

const Loader: FC = () => {
  const [animationProps, set] = useSpring(() => ({
    opacity: 0,
    scale: 1,
    config: { tension: 400, friction: 30 },
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      set({ opacity: 1, scale: 1 });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrap>
      <animated.div style={animationProps}>
        <p>loading...</p>
        <Bar />
      </animated.div>
    </Wrap>
  );
};

const load = keyframes`
	  0% {
    left: 0;
    width: 0%
  }
  25% {
    left: 0;
    width: 100%
  }
  50% {
    right: 0;
    left: auto;
    width: 100%
  }
  75% {
    right: 0;
    left: auto;
    width: 0%
  }
  100% {
    right: 0;
    left: auto;
    width: 0%
  }
  `;

const Wrap = styled(animated.span)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: ${p => p.theme.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    width: 240px;
    border: 1px solid ${p => p.theme.border.primary};
    border-radius: 4px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    p {
      color: ${p => p.theme.text.primary};
      font-size: 12px;
      text-transform: uppercase;
      margin: 0 0 12px 0;
      padding: 0;
      line-height: 10px;
      font-weight: 600;
      letter-spacing: 0.6px;
    }
  }
`;

const Bar = styled.span`
  position: relative;
  display: block;
  height: 3px;
  border-radius: 4px;
  overflow: hidden;

  :after {
    content: '';
    height: 3px;
    width: 100%;
    background: ${p => p.theme.text.primary};
    animation: ${load} cubic-bezier(0.16, 1, 0.3, 1) 3000ms infinite;
    position: absolute;
  }
`;
export default Loader;
