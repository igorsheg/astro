package category

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (c Category) List(db *gorm.DB) []Category {

	var categories []Category
	db.Preload("Services.Pings").Preload("Services").Find(&categories)
	return categories

}

func (c Category) Delete(db *gorm.DB, category_id string) Category {
	var category Category
	db.Where("ID = ?", category_id).Delete(&category)

	return category
}

func (c Category) Update(db *gorm.DB, ctx *gin.Context) Category {
	var category Category
	ctx.BindJSON(&category)
	db.Where("ID = ?", category.ID).Updates(category)

	return category

}
