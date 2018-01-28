FROM node:9.3.0

MAINTAINER Yuchong Pan <panyuchong@gmail.com>

RUN mkdir /code
WORKDIR /code

ADD package.json /code/
ADD bower.json /code/
ADD app.json /code/
ADD .env.config /code/
ADD .bowerrc /code/

RUN npm install -g bower
RUN npm install -g gulp

RUN npm install
RUN bower install --allow-root
RUN npm run config

ADD . /code/
