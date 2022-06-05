package errors

import (
	"net/http"
)

type MyError struct {
	Code int
	Msg  string
	Data interface{}
}

var (
	DuplicateEmailError = NewError(http.StatusUnprocessableEntity, "入力されたメールアドレスは既に登録されています")
)

func (e *MyError) Error() string {
	return e.Msg
}

func Unauthorized(msg ...string) *MyError {
	errorMessage := "認証エラーです"
	if len(msg) > 0 {
		errorMessage = msg[0]
	}
	return &MyError{
		Code: http.StatusUnauthorized,
		Data: errorMessage,
	}
}

func BadRequest(e error) *MyError {
	return &MyError{
		Code: http.StatusBadRequest,
		Data: e.Error(),
	}
}

func NewError(code int, msg string) *MyError {
	return &MyError{
		Msg:  msg,
		Code: code,
	}
}
