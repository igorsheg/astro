/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import Loader from 'src/components/fullpage-loader';
import { PageTransition } from 'src/components/page-transition';
import {
  configStore,
  localSrorageStore,
  themeStore,
  uiStore,
} from 'src/stores';
import GlobalStyle from 'src/styles/global';
import { ThemeProvider } from 'styled-components';
import { ModalIdentity, ModalTypes } from 'typings/internal';

const NewServiceModal = dynamic(() => import('src/modals/new-service'), {
  ssr: false,
});

const MyApp = () => {
  const { activeTheme } = localSrorageStore();
  const [mounted, mount] = useState(false);

  const { data: configData, sync: syncConfig } = configStore();
  const { data: themes, sync: syncThemes } = themeStore();
  const { activeModals, setUiStore } = uiStore();

  useEffect(() => {
    syncConfig();
    syncThemes();
  }, []);

  const ctxTheme =
    themes && themes.length
      ? themes.find(t => t.id === activeTheme)
      : activeTheme && activeTheme.length
      ? SAMPLE_THEMES[activeTheme as keyof typeof SAMPLE_THEMES]
      : SAMPLE_THEMES.dark;

  useEffect(() => {
    mount(!!configData);
  }, [configData]);

  const modalCloseRequest = (modal: ModalIdentity<any>) => {
    const ctxModalIndex = activeModals.findIndex(m => m.id === modal.id);
    setUiStore(d => {
      d.activeModals[ctxModalIndex].state = 'closed';
    });
    setTimeout(() => {
      setUiStore(d => {
        d.activeModals.splice(ctxModalIndex, 1);
      });
    }, 240);
  };

  const MODALS = {
    [ModalTypes['new-service']]: NewServiceModal,
    [ModalTypes['new-category']]: NewServiceModal,
  };

  // useEffect(() => {
  //   console.log(activeModals);
  // }, [activeModals]);

  return (
    <>
      <Head>
        <title>Astro</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/fonts/Inter.var.woff2"
          as="font"
          crossOrigin=""
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0,viewport-fit=cover"
        />
      </Head>
      <ThemeProvider theme={ctxTheme as Theme}>
        <GlobalStyle />
        {activeModals.map(modal => {
          const CtxModal = MODALS[modal.label];
          return (
            <CtxModal
              key={modal.id}
              onRequestClose={modalCloseRequest}
              modalIdentity={modal}
              title={modal.title || ''}
            />
          );
        })}
        {!configData || !mounted ? (
          <Loader />
        ) : (
          <PageTransition>
            {({ Component, pageProps }) => <Component {...pageProps} />}
          </PageTransition>
        )}
      </ThemeProvider>
    </>
  );
};

export default MyApp;
