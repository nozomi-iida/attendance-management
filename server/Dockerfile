FROM golang:1.18 as builder

ENV SERVER_ROOT /server

WORKDIR ${SERVER_ROOT}

RUN apt-get update -qq && \
    apt-get install git curl && \
    apt-get install -y postgresql-client

COPY ./go.mod ${SERVER_ROOT}
COPY ./go.sum ${SERVER_ROOT}

RUN go mod download && \
    go get -u github.com/cosmtrek/air && \
    go build -o /go/bin/air github.com/cosmtrek/air && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

ENV TZ=Asia/Tokyo

COPY ./ ${SERVER_ROOT}
COPY ./wait-for-postgres.sh /wait-for-postgres.sh

CMD ["sh", "/wait-for-postgres.sh", "db", "air", "-c", ".air.toml"]
COPY . .

RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o ${SERVER_ROOT}/main .

FROM alpine

ENV SERVER_ROOT /server

WORKDIR ${SERVER_ROOT}

COPY --from=builder ${SERVER_ROOT}/main ${SERVER_ROOT}

ENV PORT=${PORT}

CMD ["/server/main"]
