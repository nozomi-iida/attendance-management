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
	Unauthorized        = NewError(http.StatusUnauthorized, "認証エラーです")
)

func (e *MyError) Error() string {
	return e.Msg
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
