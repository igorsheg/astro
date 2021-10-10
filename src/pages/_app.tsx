/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Head from 'next/head';
import React from 'react';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import { localSrorageStore, themeStore } from 'src/stores';
import GlobalStyle from 'src/styles/global';
import { ThemeProvider } from 'styled-components';

const MyApp = ({ Component, pageProps }: any) => {
  const { data: themes } = themeStore();
  const { activeTheme } = localSrorageStore();

  const ctxTheme =
    themes && themes.length
      ? themes.find(t => t.id === activeTheme)
      : activeTheme && activeTheme.length
      ? SAMPLE_THEMES[activeTheme as keyof typeof SAMPLE_THEMES]
      : SAMPLE_THEMES.dark;

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
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default MyApp;
