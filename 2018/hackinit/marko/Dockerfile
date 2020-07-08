FROM node:12-alpine3.12

LABEL SUBMITTER="Yuchong Pan <panyuchong@gmail.com>"
LABEL MAINTAINER="Ye Shu <shuye02@outlook.com>"

WORKDIR /code

ADD package.json ./
ADD package-lock.json ./

# npm ci is for production and needs the package-lock.json
# RUN npm install
RUN npm ci --only=production

ADD . .

EXPOSE 8080
CMD [ "node", "app.js" ]
