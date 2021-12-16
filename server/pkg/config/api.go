package config

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c Config) Routes(route *gin.Engine, db *gorm.DB) {

	route.GET("/api/configs", func(ctx *gin.Context) {
		ctx.JSON(200, c.List(db))
	})

	route.GET("/api/configs/:id", func(ctx *gin.Context) {
		config_id := ctx.Param("id")
		ctx.JSON(200, c.Get(db, config_id))
	})

}
