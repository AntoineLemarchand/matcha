#!/bin/sh

set -e

sleep 10;

if [ "$NODE_ENV" = "production" ]; then
  pm2-runtime start index.js
else
  exec npm run start:backend
fi
