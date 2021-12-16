package theme

import (
	"github.com/gin-gonic/gin"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Theme struct {
	ID         string         `json:"id"`
	Label      string         `json:"label"`
	Accent     datatypes.JSON `json:"accent"`
	Background datatypes.JSON `json:"background"`
	Text       datatypes.JSON `json:"text"`
	Border     datatypes.JSON `json:"border"`
}

func NewService(ctx *gin.Engine, db *gorm.DB) Theme {

	theme := Theme{}
	theme.Routes(ctx, db)

	return theme

}
