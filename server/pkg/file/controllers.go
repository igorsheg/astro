package file

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (f File) Upload(db *gorm.DB, c *gin.Context) File {

	file, err := c.FormFile("logo")
	if err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("get form err: %s", err.Error()))
	}

	file_name := uuid.New().String() + "-" + strings.TrimSpace(file.Filename)
	file_path := "../web/public/logos/"

	if err := c.SaveUploadedFile(file, file_path+file_name); err != nil {
		c.String(http.StatusBadRequest, fmt.Sprintf("upload file err: %s", err.Error()))
	}

	f.Path = file_name
	return f

}
