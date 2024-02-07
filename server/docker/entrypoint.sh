#!/bin/sh

set -e

sleep 10

if [ "$NODE_ENV" = "production" ]; then
    npm run build
    exec serve -s build
else
    exec npm run start:backend
fi
