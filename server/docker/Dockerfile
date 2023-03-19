FROM node:16-alpine

WORKDIR /app

COPY /server/package*.json ./
COPY .env ./
RUN npm install

COPY server/ .

EXPOSE 8000

CMD ["sh", "./docker/entrypoint.sh"]
