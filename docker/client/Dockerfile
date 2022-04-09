FROM node:16.13.0

ENV CLIENT_ROOT /client
WORKDIR ${CLIENT_ROOT}

COPY ./client ${CLIENT_ROOT}

RUN npm install

COPY ./client ${CLIENT_ROOT}
