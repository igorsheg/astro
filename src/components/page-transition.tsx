import { NextRouter, useRouter } from 'next/router';
import React from 'react';
import { animated, useTransition } from 'react-spring';

interface EnchancedRouter extends NextRouter {
  components: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [a: string]: any;
  };
}

interface PageTransitionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (e: any) => JSX.Element;
}

export const PageTransition = ({
  children,
}: PageTransitionProps): JSX.Element => {
  const router = useRouter() as EnchancedRouter;

  const transitions = useTransition(router, router => router.pathname, {
    initial: { opacity: 1, transform: 'translateX(0px)' },
    from: { opacity: 0, transform: 'translateX(15px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0,
      transform: 'translateX(-15px)',
    },
    config: { tension: 300, velocity: 20, friction: 35 },
  });

  return (
    <>
      {transitions.map(({ item, props: style, key }) => {
        const { Component, props } = item.components[item.pathname] || {};

        return (
          <animated.main key={key} style={style}>
            {children(
              item ? { Component, pageProps: props && props.pageProps } : {},
            )}
          </animated.main>
        );
      })}
    </>
  );
};
