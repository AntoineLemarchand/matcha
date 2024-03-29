FROM node:16-alpine

WORKDIR /app

COPY /client/package*.json ./
COPY .env ./
RUN npm install
RUN npm install -g serve

COPY client/ .

EXPOSE 3000

CMD ["sh", "./docker/entrypoint.sh"]
