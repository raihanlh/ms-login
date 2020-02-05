FROM node:12.14.1-alpine

WORKDIR /project

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 9001
CMD ["node", "server.js"]