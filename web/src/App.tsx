import { FC, PropsWithChildren, memo, useContext, useState } from "react";
import { ThemeContext } from "./components/ThemeProvider";
import { vars } from "./styles/index.css";
import { Service, UptimeStatus } from "./models/service"; // Import your async thunks
import { useFetchServicesQuery } from "./services/api";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";

const App = () => {
  const { toggleTheme } = useContext(ThemeContext);
  const [tab, setTab] = useState("home-media");

  const { services } = useFetchServicesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      services: data?.filter((scv) => scv.category_id === tab),
    }),
  });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <button onClick={toggleTheme}>Theme!</button>
      <button onClick={() => setTab("utilities")}>tab!</button>

      <div
        style={{
          fontSize: vars.fontSize["0x"],
          width: 600,
          height: 800,
          overflow: "auto",
        }}
      >
        {services &&
          services.map((svc) => <SingleService key={svc.id} svc={svc} />)}
      </div>
    </div>
  );
};

const SingleService: FC<PropsWithChildren<{ svc: Service }>> = memo(
  ({ svc }) => {
    return (
      <>
        <p>{svc.name}</p>
        {svc.status && <ServiceUptimeChart data={svc.status} />}
      </>
    );
  },
);

const ServiceUptimeChart: React.FC<{ data: UptimeStatus[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="#8884d8"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default App;
