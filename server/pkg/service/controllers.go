package service

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-co-op/gocron"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (c Service) List(db *gorm.DB) []Service {
	var services []Service
	db.Preload("Pings").Find(&services)
	return services
}

func (c Service) Get(db *gorm.DB, service_id string) Service {
	var service Service
	db.Preload("Pings").Find(&service, "id = ?", service_id)
	return service
}

func (c Service) Create(db *gorm.DB, context *gin.Context) Service {
	var service Service

	context.BindJSON(&service)
	fmt.Println(service.Name)
	new_service := Service{
		ID:          uuid.NewString(),
		Name:        service.Name,
		Description: service.Description,
		Target:      service.Target,
		Logo:        service.Logo,
		Url:         service.Url,
		CategoryId:  service.CategoryId,
	}
	db.Create(&new_service)

	return service
}

func (c Service) Delete(db *gorm.DB, service_id string) Service {
	var service Service
	db.Where("ID = ?", service_id).Delete(&service)

	return service
}

func (c Service) Update(db *gorm.DB, ctx *gin.Context) Service {
	var service Service
	ctx.BindJSON(&service)
	db.Where("ID = ?", service.ID).Updates(service)

	return service
}

func (p Ping) PingServices(db *gorm.DB) {
	var services_model []Service
	db.Find(&services_model)
	cron := gocron.NewScheduler(time.UTC)

	cron.Every(6).Minute().Do(func() {
		for _, s := range services_model {

			start := time.Now()
			resp, err := http.Get(s.Url)
			if err != nil {
				if !(resp != nil && resp.StatusCode > 0) {
					log.Printf("%s - %v\n", s.Url, err)
					return
				}
			}
			p := Ping{
				StatusCode: resp.StatusCode,
				Latency:    time.Since(start).Milliseconds(),
				ID:         uuid.New().String(), ServiceId: s.ID,
			}

			db.Create(&p)
			// log.Printf(" %s - %d -  %v", s.Url, resp.StatusCode, time.Since(start))
		}

	})

	cron.StartAsync()

}
