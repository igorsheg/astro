package category

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c Category) Routes(route *gin.Engine, db *gorm.DB) {

	route.GET("/api/categories", func(ctx *gin.Context) {
		ctx.JSON(200, c.List(db))
	})

	route.PATCH("/api/categories/:id", func(ctx *gin.Context) {
		ctx.JSON(200, c.Update(db, ctx))
	})

	route.DELETE("/api/categories/:id", func(ctx *gin.Context) {
		category_id := ctx.Param("id")
		ctx.JSON(200, c.Delete(db, category_id))
	})

}
