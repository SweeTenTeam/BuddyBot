FROM node:latest

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","adapter/in/event/MessageListener.js"]