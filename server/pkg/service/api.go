package service

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c Service) Routes(route *gin.Engine, db *gorm.DB) {

	route.GET("/api/services", func(ctx *gin.Context) {
		ctx.JSON(200, c.List(db))

	})

	route.GET("/api/services/:id", func(ctx *gin.Context) {
		service_id := ctx.Param("id")
		ctx.JSON(200, c.Get(db, service_id))
	})

	route.POST("/api/services", func(ctx *gin.Context) {
		ctx.JSON(200, c.Create(db, ctx))
	})

	route.PATCH("/api/services/:id", func(ctx *gin.Context) {
		ctx.JSON(200, c.Update(db, ctx))
	})

	route.DELETE("/api/services/:id", func(ctx *gin.Context) {
		service_id := ctx.Param("id")
		ctx.JSON(200, c.Delete(db, service_id))
	})

}
