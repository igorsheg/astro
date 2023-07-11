import { useContext, useState } from "react";
import { ThemeContext } from "./components/ThemeProvider";
import { useFetchServicesQuery } from "./services/api";
import BentoGrid from "./components/BentoGrid/BentoGrid";
import { SingleService } from "./components/Service/Service";
import { vars } from "./styles/index.css";
import Button from "./components/Button/Button";
import Box from "./components/Box/Box";

const App = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const [tab, setTab] = useState("home-media");

  const { services } = useFetchServicesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      services: data?.filter((scv) => scv.category_id === tab),
    }),
  });

  return (
    <div
      style={{
        maxHeight: "100vh",
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        padding: `0 ${vars.spacing.s12}`,
      }}
    >
      <Box bleedBottom={-30} orientation="row">
        <Button onClick={toggleTheme}>Theme!</Button>
        <button onClick={() => setTab("utilities")}>tab!</button>
      </Box>
      <BentoGrid>
        {services &&
          services.map((svc, i) => (
            <BentoGrid.Item
              key={svc.id}
              priority={i === 0 ? "high" : i === 7 ? "medium" : "none"}
            >
              <SingleService svc={svc} />
            </BentoGrid.Item>
          ))}
      </BentoGrid>
    </div>
  );
};

export default App;
