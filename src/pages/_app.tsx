/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import { ModalIdentity } from 'shared/types/internal';
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

  const modalCloseRequest = (modal: ModalIdentity) => {
    setUiStore(d => {
      const ctxModalIndex = d.activeModals.findIndex(m => m.id === modal.id);
      d.activeModals[ctxModalIndex].state = 'closed';
    });
  };

  const isModalOpen = (id: ModalIdentity['id']) => {
    return activeModals.find(modal => modal.id === id)?.state === 'expnanded';
  };

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
        <NewServiceModal
          onRequestClose={modalCloseRequest}
          isOpen={isModalOpen('new-service')}
          title="Create New Service"
        />
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
