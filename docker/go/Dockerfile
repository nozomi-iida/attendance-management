FROM golang:1.18

ENV SERVER_ROOT /server
WORKDIR ${SERVER_ROOT}

RUN apt-get update -qq && \
    apt-get install git

COPY ./server/go.mod ${SERVER_ROOT}
COPY ./server/go.sum ${SERVER_ROOT}

RUN go mod download && \
    go get -u github.com/cosmtrek/air && \
    go build -o /go/bin/air github.com/cosmtrek/air

COPY ./server ${SERVER_ROOT}

CMD ["air", "-c", ".air.toml"]
