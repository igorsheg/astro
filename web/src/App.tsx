import { useContext, useState } from "react";
import { ThemeContext } from "./components/ThemeProvider";
import { useFetchServicesByCategoryQuery } from "./services/api";
import { vars } from "./styles/index.css";
import Button from "./components/Button/Button";
import Box from "./components/Box/Box";
import { SortableGrid } from "./components/Services/Grid";

const App = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const [tab, setTab] = useState("home-media");

  // const { services } = useFetchServicesQuery(undefined, {
  //   selectFromResult: ({ data }) => ({
  //     services: data?.filter((scv) => scv.category_id === tab),
  //   }),
  // });
  //
  const { data: services, isLoading } = useFetchServicesByCategoryQuery(tab, {
    pollingInterval: 31000,
  });

  if (isLoading) {
    return <div>Loading</div>;
  }
  if (!services) {
    return <div>No posts :(</div>;
  }

  return (
    <div
      style={{
        maxHeight: "100vh",
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        padding: `0 ${vars.spacing.s4}`,
      }}
    >
      <Box bleedBottom={-30} orientation="row">
        <Button onClick={toggleTheme}>Theme!</Button>
        <button onClick={() => setTab("utilities")}>tab!</button>
      </Box>
      <SortableGrid items={services} />
    </div>
  );
};

export default App;
