FROM node:14-alpine

WORKDIR .

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "backend.js"]
