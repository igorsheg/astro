package theme

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (t Theme) Routes(route *gin.Engine, db *gorm.DB) {

	route.GET("/api/themes", func(ctx *gin.Context) {
		ctx.JSON(200, t.List(db))
	})

}
