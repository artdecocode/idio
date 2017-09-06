FROM node:alpine

ADD . /app
WORKDIR /app
RUN npm install --production

CMD ["npm", "run", "start"]
