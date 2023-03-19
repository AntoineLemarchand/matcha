FROM node:16-alpine

WORKDIR /app

COPY /client/package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["sh", "./docker/entrypoint.sh"]
