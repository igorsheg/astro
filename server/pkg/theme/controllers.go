package theme

import (
	"gorm.io/gorm"
)

func (c Theme) List(db *gorm.DB) []Theme {
	var themes []Theme
	db.Find(&themes)
	return themes
}
