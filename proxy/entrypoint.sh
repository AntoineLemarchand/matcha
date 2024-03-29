#!/bin/sh

# Define paths
CERT_PATH="/etc/nginx/ssl/certs/matcha.crt"
KEY_PATH="/etc/nginx/ssl/private/matcha.key"

# Ensure the directory exists for the certificate and key
mkdir -p /etc/nginx/ssl/certs
mkdir -p /etc/nginx/ssl/private

envsubst '$SERVER_PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
echo "[INFO] Nginx configuration initialized"

# Generate certificate and key if they don't exist
if [ ! -f "$CERT_PATH" ] || [ ! -f "$KEY_PATH" ]; then
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$KEY_PATH" -out "$CERT_PATH" \
    -subj "/C=FR/ST=Paris/L=Paris/O=fortytwo/OU=matcha/CN=localhost"
  echo "[INFO] Certificate and key generated"
fi

# Start Nginx
echo "[INFO] Starting Nginx"
nginx -g 'daemon off;'
