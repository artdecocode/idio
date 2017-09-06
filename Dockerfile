FROM node:alpine

ADD package.json /app/package.json
RUN cd /app && npm install --production

ADD . /app
WORKDIR /app
RUN npm install --production

CMD ["npm", "run", "start"]
