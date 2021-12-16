package config

import (
	"gorm.io/gorm"
)

func (c Config) List(db *gorm.DB) []Config {
	var configs []Config
	db.Find(&configs)
	return configs
}

func (c Config) Get(db *gorm.DB, config_id string) Config {
	var config Config
	db.First(&config, "id = ?", config_id)
	return config
}
