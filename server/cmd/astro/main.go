package main

import (
	"astro/pkg/handlers"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {

	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	ginEngine := gin.Default()

	db, err := gorm.Open(sqlite.Open("data/astrodb.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	handlers.InitDb(db)
	handlers.SetupRoutes(ginEngine, db)

	ginEngine.Run(os.Getenv("HTTP_ADDRESS") + ":" + os.Getenv("HTTP_PORT"))
}
