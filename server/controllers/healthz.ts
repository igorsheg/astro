import { Context } from 'koa';
import { getConnectionManager } from 'typeorm';
import { performance } from 'perf_hooks';
import axios from 'axios';
import { default as pingIt } from 'ping';

const healthcheck = {
  uptime: process.uptime(),
  message: 'OK',
  timestamp: Date.now(),
};

interface HealthzControllerProps {
  ping: (ctx: Context) => Promise<typeof healthcheck>;
  pingDb: (ctx: Context) => Promise<boolean | string>;
}

export default (): HealthzControllerProps => {
  const ping = async (ctx: Context) => {
    try {
      return (ctx.body = healthcheck);
    } catch (e: any) {
      ctx.status = 503;
      healthcheck.message = e.message;
      return (ctx.body = healthcheck);
    }
  };

  const pingDb = async (ctx: Context) => {
    const dbConnection = getConnectionManager();

    try {
      return (ctx.body = dbConnection.get().isConnected);
    } catch (e: any) {
      ctx.status = 503;
      return (ctx.body = e.message);
    }
  };

  return {
    ping,
    pingDb,
  };
};
