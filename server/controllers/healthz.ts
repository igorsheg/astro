import { Context } from 'koa';
import { ConnectionManager, getConnectionManager } from 'typeorm';

interface HealthzControllerProps {
  ping: (ctx: Context) => Promise<any>;
  pingDb: (ctx: Context) => Promise<any>;
}

export default (): HealthzControllerProps => {
  const ping = async (ctx: Context) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };

    try {
      return (ctx.body = healthcheck);
    } catch (e) {
      ctx.status = 503;
      healthcheck.message = e.message;
      return (ctx.body = healthcheck);
    }
  };

  const pingDb = async (ctx: Context) => {
    const dbConnection = getConnectionManager();

    try {
      return (ctx.body = dbConnection.get().isConnected);
    } catch (e) {
      ctx.status = 503;
      return (ctx.body = e.message);
    }
  };

  return {
    ping,
    pingDb,
  };
};
