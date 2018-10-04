FROM node:10-alpine

WORKDIR /usr/src/app
COPY . ./

RUN yarn && yarn build

EXPOSE 80
CMD ["node", "dist/index.js"]
