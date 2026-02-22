FROM node:22-alpine as build

WORKDIR /client
COPY client/package*.json ./
RUN npm install && npm cache clean --force

COPY client/ ./

RUN npm run build



FROM node:22-alpine

WORKDIR /app
COPY server/package*.json ./
RUN npm install && npm cache clean --force

COPY server/ ./server
COPY --from=build /client/dist ./client/dist

EXPOSE 5000

CMD ["node", "./server/index.js"]