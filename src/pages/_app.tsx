/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SAMPLE_THEMES } from 'server/config/seed-data';
import { Theme } from 'server/entities';
import Loader from 'src/components/fullpage-loader';
import { PageTransition } from 'src/components/page-transition';
import { configStore, localSrorageStore, themeStore } from 'src/stores';
import GlobalStyle from 'src/styles/global';
import { ThemeProvider } from 'styled-components';

const MyApp = () => {
  const { activeTheme } = localSrorageStore();
  const [mounted, mount] = useState(false);

  const { data: configData, sync: syncConfig } = configStore();
  const { data: themes, sync: syncThemes } = themeStore();

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
    const timer = setTimeout(() => {
      mount(true);
    }, 420);
    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();

  router.pathname;

  return (
    <ThemeProvider theme={ctxTheme as Theme}>
      <GlobalStyle />
      {!configData || !mounted ? (
        <Loader />
      ) : (
        <PageTransition>
          {({ Component, pageProps }: AppProps) => <Component {...pageProps} />}
        </PageTransition>
      )}
    </ThemeProvider>
  );
};

export default MyApp;
