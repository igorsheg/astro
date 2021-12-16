package config

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Config struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	Subtitle   string `json:"subtitle"`
	FirstTimer string `json:"fisrtTimer"`
}

func NewService(ctx *gin.Engine, db *gorm.DB) Config {

	config := Config{}
	config.Routes(ctx, db)

	return config

}
