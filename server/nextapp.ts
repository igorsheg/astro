import next from 'next';
import { isDevMode } from './config/serverConfig';

const nextapp = next({ dev: isDevMode });

export default nextapp;
