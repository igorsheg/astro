import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ThemeContext } from "./components/ThemeProvider";
import { observer } from "mobx-react-lite";
import { vars } from "./styles/index.css";
import { StoreContext } from "./store";
import { ServiceType } from "./store/service";

const App = observer(() => {
  const { toggleTheme } = useContext(ThemeContext);
  const Store = useContext(StoreContext);
  const [tab, setTab] = useState("home-media");
  const services = Store.servicesStore.getServicesByCategory(tab);

  useEffect(() => {
    Store.fetchData();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={toggleTheme}>Theme!</button>
      <button onClick={() => setTab("utilities")}>tab!</button>

      <div
        style={{
          fontSize: vars.fontSize["0x"],
          width: 600,
          height: 300,
          overflow: "auto",
        }}
      >
        {services.map((svc) => (
          <Service svc={svc} />
        ))}
      </div>
    </div>
  );
});

const Service: FC<PropsWithChildren<{ svc: ServiceType }>> = observer(
  ({ svc }) => {
    return (
      <>
        <p>{svc.name}</p>
        <pre>{JSON.stringify(svc.status, null, 2)}</pre>
      </>
    );
  }
);
export default App;
