FROM node:22-alpine
WORKDIR /server

ENV DATABASE_URL='mariadb://root:root@mariadb:3306/test_db'

COPY package*.json ./
RUN npm install
COPY . .

RUN npm install -g typescript
RUN tsc

EXPOSE 3000

ENTRYPOINT ["node", "build/index.js"]