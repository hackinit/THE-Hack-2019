FROM node:12-alpine3.12

LABEL SUBMITTER="Ye Shu <chshu@protonmail.ch>"
LABEL MAINTAINER="Ye Shu <chshu@protonmail.ch>"

WORKDIR /code/server/
ENV NODE_ENV=production

COPY server /code/server/
RUN cd /code/server && yarn

COPY static /code/static/

VOLUME [ "/code/static" ]
VOLUME [ "/code/server/static" ]

EXPOSE 8080
CMD [ "node", "/code/server/server.js" ]
