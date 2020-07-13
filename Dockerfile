FROM node:11.10.0

WORKDIR /usr/app

COPY /package.json .

RUN npm install -g yarn
RUN apt-get update && apt-get install -y vim
RUN yarn install
COPY . .

