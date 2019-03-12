FROM node:10.15.3

LABEL SUBMITTER="Yuchong Pan <panyuchong@gmail.com>"
LABEL MAINTAINER="Ye Shu <shuye02@outlook.com>"

RUN mkdir /code
WORKDIR /code

RUN cd /code && npm install express --save
RUN cd /code && npm install marko --save

ADD . /code/
