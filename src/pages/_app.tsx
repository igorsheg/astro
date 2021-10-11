/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Head from 'next/head';
import React, { useCallback, useEffect } from 'react';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import { localSrorageStore, themeStore } from 'src/stores';
import GlobalStyle from 'src/styles/global';
import { ThemeProvider } from 'styled-components';

const MyApp = ({ Component, pageProps }: any) => {
  const { data: themes, sync: syncThemes } = themeStore();
  const { activeTheme } = localSrorageStore();

  useEffect(() => {
    syncThemes();
  }, []);

  const ctxTheme = useCallback(() => {
    return (
      (themes && themes.find(t => t.id === activeTheme)) || SAMPLE_THEMES.dark
    );
  }, [activeTheme]);

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
      <ThemeProvider theme={ctxTheme() as Theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
