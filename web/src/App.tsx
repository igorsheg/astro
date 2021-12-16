import React, { useCallback } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./consts/globalStyles";
import { localSrorageStore } from "./stores";
import { SAMPLE_THEMES } from "./consts/seed-data";
import { Theme } from "./types";
import { useQuery } from "react-query";
import { fetcher } from "./utils";

export function App() {
  const { data: themes } = useQuery("themes", () =>
    fetcher<Theme[]>(["themes"])
  );
  const { activeThemeId } = localSrorageStore();

  const ctxTheme = useCallback(
    () =>
      (themes && themes.find((t) => t.id === activeThemeId)) ||
      SAMPLE_THEMES.dark,
    [activeThemeId]
  );

  return (
    <Routes>
      <Route path="/" element={<Layout ctxTheme={ctxTheme} />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function Layout({ ctxTheme }: { ctxTheme: () => Theme }) {
  return (
    <ThemeProvider theme={ctxTheme()}>
      <GlobalStyle />
      <Outlet />
    </ThemeProvider>
  );
}
