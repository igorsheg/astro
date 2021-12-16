package file

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type File struct {
	Path string `json:"path"`
}

func NewService(ctx *gin.Engine, db *gorm.DB) File {

	file := File{}
	file.Routes(ctx, db)

	return file

}
