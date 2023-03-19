#!/bin/sh

set -e

if [ "$NODE_ENV" = "production" ]; then
    npm run build
    exec serve -s build
else
    exec npm run start:frontend
fi
