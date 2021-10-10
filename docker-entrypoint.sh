#!/bin/sh
node bin/server/config/initDb.js &&
NODE_ENV=production node bin/server/index.js