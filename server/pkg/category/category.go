package category

import (
	"astro/pkg/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Category struct {
	ID          string            `json:"id"`
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Icon        string            `json:"icon"`
	Services    []service.Service `json:"services"`
}

func NewService(ctx *gin.Engine, db *gorm.DB) Category {

	category := Category{}
	category.Routes(ctx, db)

	return category

}
