package handlers

import (
	"astro/pkg/category"
	"astro/pkg/config"
	"astro/pkg/file"
	"astro/pkg/service"
	"astro/pkg/theme"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(ctx *gin.Engine, db *gorm.DB) *gin.Engine {

	ctx.Static("/statics", "../web/statics")
	ctx.Static("/public", "../web/public")
	ctx.LoadHTMLFiles("../web/index.html")
	ctx.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{})
	})

	service.NewService(ctx, db)
	category.NewService(ctx, db)
	config.NewService(ctx, db)
	theme.NewService(ctx, db)
	file.NewService(ctx, db)

	return ctx
}
