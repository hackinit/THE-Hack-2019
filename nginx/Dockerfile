FROM nginx:1.13.7

MAINTAINER Yuchong Pan <panyuchong@gmail.com>

ADD ./nginx.conf /etc/nginx
ADD ./mime.types /etc/nginx
ADD ./secrets.htpasswd /etc/nginx/.htpasswd

ADD ./secrets.ssl/ /etc/ssl
