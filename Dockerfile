FROM node:11.10.0

WORKDIR /usr/app

COPY /package.json .

RUN npm install -g yarn
RUN yarn install
COPY . .

