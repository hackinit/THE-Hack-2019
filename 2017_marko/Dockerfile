FROM node:7-alpine
MAINTAINER Yuchong Pan <panyuchong@gmail.com>

RUN mkdir /code
WORKDIR /code

RUN cd /code && npm install express --save
RUN cd /code && npm install marko --save

ADD . /code/
