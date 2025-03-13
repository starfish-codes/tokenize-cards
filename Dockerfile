FROM node:21-alpine

WORKDIR /app

COPY server/node-ts/package*.json ./
RUN npm install

COPY server/node-ts/tsconfig.json .
COPY server/node-ts/src ./src

COPY client ./client

EXPOSE 4711

ENV HELLGATE_BACKEND=""
ENV HELLGATE_API_KEY=""
ENV CLIENT_DIR="/app/client"

CMD ["npm", "start"]
