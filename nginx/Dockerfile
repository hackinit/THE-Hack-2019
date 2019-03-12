FROM nginx:1.15.9

LABEL SUBMITTER="Yuchong Pan <panyuchong@gmail.com>"
LABEL MAINTAINER="Ye Shu <shuye02@outlook.com>"

ADD ./nginx.conf /etc/nginx
ADD ./mime.types /etc/nginx

ADD ./ssl /etc/nginx/ssl

ADD ./secrets.htpasswd /etc/nginx/.htpasswd
ADD ./secrets.htpasswd.sponsors /etc/nginx/.htpasswd.sponsors
