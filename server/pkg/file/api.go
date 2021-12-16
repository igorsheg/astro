package file

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (f File) Routes(ctx *gin.Engine, db *gorm.DB) {

	ctx.MaxMultipartMemory = 8 << 20

	ctx.POST("/api/upload", func(c *gin.Context) {
		c.JSON(200, f.Upload(db, c))
	})

}
