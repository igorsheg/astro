package service

import (
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Ping struct {
	ID         string    `json:"id"`
	StatusCode int       `json:"status_code"`
	Latency    int64     `json:"latency"`
	CreatedAt  time.Time `json:"created_at"`
	ServiceId  string    `json:"service_id"`
}

type Service struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Logo        string    `json:"logo"`
	Url         string    `json:"url"`
	Target      string    `json:"target"`
	Tags        string    `json:"tags"`
	CreatedAt   time.Time `json:"created_at"`
	CategoryId  string    `json:"category_id"`
	Pings       []Ping    `json:"pings"`
}

func NewService(ctx *gin.Engine, db *gorm.DB) Service {

	service := Service{}
	ping := Ping{}

	service.Routes(ctx, db)
	ping.PingServices(db)

	return service

}
