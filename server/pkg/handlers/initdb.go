package handlers

import (
	"astro/pkg/category"
	"astro/pkg/config"
	"astro/pkg/service"
	"astro/pkg/theme"
	"fmt"

	"github.com/fatih/color"
	"github.com/google/uuid"
	"github.com/mbndr/figlet4go"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

func tableExists(db *gorm.DB) bool {

	return db.Migrator().HasTable(&config.Config{}) &&
		db.Migrator().HasTable(&service.Service{}) &&
		db.Migrator().HasTable(&category.Category{}) &&
		db.Migrator().HasTable(&theme.Theme{})
}

func InitDb(db *gorm.DB) {

	ascii := figlet4go.NewAsciiRender()
	options := figlet4go.NewRenderOptions()
	options.FontName = "larry3d"
	renderStr, _ := ascii.RenderOpts("Astro", options)
	fmt.Print(renderStr)

	if tableExists(db) {
		color.Green("---> Using existing databse")
		return
	}

	color.Green("---> Initiating Data")
	color.Green("---> Migrating Entities")
	db.AutoMigrate(&service.Service{}, &category.Category{}, &theme.Theme{}, &config.Config{}, &service.Ping{})

	services_utilites := []service.Service{
		{
			ID:          uuid.New().String(),
			Name:        "Unifi",
			Description: "Network management software solution from Ubiquiti.",
			Url:         "https://github.com/k8s-at-home/charts/tree/master/charts/unifi",
			Target:      "_blank",
			Logo:        "demo-unifi.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "AdGuard Home",
			Description: "Network-wide software for blocking ads & tracking.",
			Url:         "https://github.com/AdguardTeam/AdGuardHome",
			Target:      "_blank",
			Logo:        "demo-adguard.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Homebridge",
			Description: "Adds HomeKit support to your non-HomeKit smart home devices.",
			Url:         "https://homebridge.io",
			Target:      "_blank",
			Logo:        "demo-homebridge.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Home Assistant",
			Description: "Open source home automation that puts local control and privacy first.",
			Url:         "https://www.home-assistant.io",
			Target:      "_blank",
			Logo:        "demo-homeassistant.png",
		},
	}

	services_home_media := []service.Service{
		{
			ID:          uuid.New().String(),
			Name:        "Plex",
			Description: "Global streaming service.",
			Url:         "https://www.plex.tv",
			Target:      "_blank",
			Logo:        "demo-plex.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Sonarr",
			Description: "A PVR for Usenet and BitTorrent users.",
			Url:         "https://sonarr.tv",
			Target:      "_blank",
			Logo:        "demo-sonarr.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Radarr",
			Description: "A movie collection manager for Usenet and BitTorrent users.",
			Url:         "https://radarr.video",
			Target:      "_blank",
			Logo:        "demo-radarr.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Bazarr",
			Description: "Manages and downloads subtitles.",
			Url:         "https://www.bazarr.media",
			Target:      "_blank",
			Logo:        "demo-bazarr.png",
		},
		{
			ID:          uuid.New().String(),
			Name:        "Jackett",
			Description: "API Support for your favorite torrent trackers.",
			Url:         "https://github.com/Jackett/Jackett",
			Target:      "_blank",
			Logo:        "demo-jackett.png",
		},
	}

	categories := []category.Category{
		{
			ID:          uuid.New().String(),
			Name:        "Utilities",
			Description: "Stuff that makes a lab awesome",
			Icon:        "MixerVerticalIcon",
			Services:    services_utilites,
		},
		{
			ID:          uuid.New().String(),
			Name:        "Home Media",
			Description: "All media related stuff",
			Icon:        "VideoIcon",
			Services:    services_home_media,
		},
	}

	configs := []config.Config{
		{
			ID:       "default-config",
			Title:    "Astro",
			Subtitle: "Your personal space",
		},
	}

	themes := []theme.Theme{
		{
			ID:         "dark",
			Label:      "Dark Theme",
			Background: datatypes.JSON([]byte(`{"primary":"#2e2f30","secondary":"#222324","ternary":"#191A1B"}`)),
			Text:       datatypes.JSON([]byte(`{"primary":"#FFFFFF","secondary":"#cbcecf"}`)),
			Border:     datatypes.JSON([]byte(`{"primary":"#4D4E4F","secondary":"#4D4E4F"}`)),
			Accent:     datatypes.JSON([]byte(`{"primary":"#0071e3","secondary":"#147ce5"}`)),
		},
		{
			ID:         "light",
			Label:      "Light Theme",
			Background: datatypes.JSON([]byte(`{"primary":"#FFFFFF","secondary":"#F6F7F7","ternary":"#E9EAEA"}`)),
			Text:       datatypes.JSON([]byte(`{"primary":"#000000","secondary":"#696b6c"}`)),
			Border:     datatypes.JSON([]byte(`{"primary":"#E5E5E5","secondary":"#E5E5E5"}`)),
			Accent:     datatypes.JSON([]byte(`{"primary":"#0071e3","secondary":"#147ce5"}`)),
		},
	}

	color.Green("---> Seeding example categories")
	db.Create(&categories)

	db.Create(&configs)
	color.Green("---> Seeding example configs")

	db.Create(&themes)
	color.Green("---> Seeding example themes")
}
