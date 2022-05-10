FROM golang:1.18

ENV SERVER_ROOT /server

WORKDIR ${SERVER_ROOT}

RUN apt-get update -qq && \
    apt-get install git && \
    apt install -y postgresql-client

COPY ./server/go.mod ${SERVER_ROOT}
COPY ./server/go.sum ${SERVER_ROOT}

RUN go mod download && \
    go get -u github.com/cosmtrek/air && \
    go build -o /go/bin/air github.com/cosmtrek/air && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

ENV TZ=Asia/Tokyo

COPY ./server ${SERVER_ROOT}
COPY ./docker/go/wait-for-postgres.sh /wait-for-postgres.sh

CMD ["sh", "/wait-for-postgres.sh", "db", "air", "-c", ".air.toml"]
