FROM node:16-alpine

WORKDIR /app

COPY /client/package*.json ./
COPY .env ./
RUN npm install

COPY client/ .

EXPOSE 3000

CMD ["sh", "./docker/entrypoint.sh"]
