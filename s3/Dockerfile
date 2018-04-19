FROM python:2.7

MAINTAINER Yuchong Pan <panyuchong@gmail.com>

RUN mkdir /code
WORKDIR /code

ADD requirements.txt /code/
RUN pip install -r requirements.txt

RUN mkdir /root/.aws
ADD secrets.aws/config /root/.aws/
ADD secrets.aws/credentials /root/.aws/credentials

ADD . /code/
