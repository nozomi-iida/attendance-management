package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/nozomi-iida/attendance-management/lib/errors"
	"net/http"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		for _, e := range c.Errors {
			err := e.Err
			if myErr, ok := err.(*errors.MyError); ok {
				c.JSON(myErr.Code, gin.H{
					"code": myErr.Code,
					"msg":  myErr.Msg,
					"data": myErr.Data,
				})
			} else {
				c.JSON(http.StatusInternalServerError, gin.H{
					"code": 500,
					"msg":  "Server exception",
					"data": err.Error(),
				})
			}
			return
		}
	}
}
