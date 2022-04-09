FROM node:16.14.2

ENV CLIENT_ROOT /client
WORKDIR ${CLIENT_ROOT}

COPY ./client ${CLIENT_ROOT}

RUN npm install

COPY ./client ${CLIENT_ROOT}
