FROM node:9.3.0

MAINTAINER Yuchong Pan <panyuchong@gmail.com>

RUN mkdir /code
WORKDIR /code

ADD package.json /code/
ADD bower.json /code/
ADD app.json /code/

RUN apt-get -qq update
RUN apt-get -qq -y install bower

RUN npm install
RUN bower install
RUN npm run config

ADD . /code/
