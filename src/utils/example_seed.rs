use chrono::Utc;

use crate::{
    domain::{
        category::{Category, CategoryRepository},
        client_config::{Config, ConfigRepository},
        service::{Service, ServiceRepository},
    },
    infra::error::AstroError,
};

pub fn seed_sample_data(
    config_repo: &ConfigRepository,
    category_repo: &CategoryRepository,
    service_repo: &ServiceRepository,
) -> Result<(), AstroError> {
    // Create sample config
    let config = Config {
        id: Some("default-config".to_string()),
        title: "Astro".to_string(),
        subtitle: "Your personal space".to_string(),
        created_at: None,
        updated_at: None,
    };
    config_repo.insert(&config)?;

    // Create sample categories
    let categories = vec![
        Category {
            id: "home-media".to_string(),
            name: "Home Media".to_string(),
            description: "Global streaming service".to_string(),
            icon: "VideoIcon".to_string(),
        },
        Category {
            id: "utilities".to_string(),
            name: "Utilities".to_string(),
            description: "A movie collection manager for Usenet and BitTorrent users".to_string(),
            icon: "MixerVerticalIcon".to_string(),
        },
    ];
    for category in categories {
        category_repo.insert(category)?;
    }

    let services = vec![
        Service {
            id: "plex".to_string(),
            name: "Plex".to_string(),
            description: "Global streaming service".to_string(),
            tags: "app, server".to_string(),
            url: "https://www.plex.tv".to_string(),
            logo: "demo-plex.png".to_string(),
            category_id: Some("home-media".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "radarr".to_string(),
            name: "Radarr".to_string(),
            description: "A movie collection manager for Usenet and BitTorrent users".to_string(),
            tags: "app, server".to_string(),
            url: "https://radarr.video".to_string(),
            logo: "demo-radarr.png".to_string(),
            category_id: Some("home-media".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "sonarr".to_string(),
            name: "Sonarr".to_string(),
            description: "A PVR for Usenet and BitTorrent users".to_string(),
            tags: "app, server".to_string(),
            url: "https://sonarr.tv".to_string(),
            logo: "demo-sonarr.png".to_string(),
            category_id: Some("home-media".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "bazarr".to_string(),
            name: "Bazarr".to_string(),
            description: "Manages and downloads subtitles".to_string(),
            tags: "app, server".to_string(),
            url: "https://www.bazarr.media".to_string(),
            logo: "demo-bazarr.png".to_string(),
            category_id: Some("home-media".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "jackett".to_string(),
            name: "Jackett".to_string(),
            description: "API Support for your favorite torrent trackers".to_string(),
            tags: "app, server".to_string(),
            logo: "demo-jackett.png".to_string(),
            url: "https://github.com/Jackett/Jackett".to_string(),
            category_id: Some("home-media".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "home-assistant".to_string(),
            name: "Home Assistant".to_string(),
            description: "Open source home automation that puts local control and privacy first."
                .to_string(),
            tags: "app, server".to_string(),
            logo: "demo-homeassistant.png".to_string(),
            url: "https://www.home-assistant.io".to_string(),
            category_id: Some("utilities".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "homebridge".to_string(),
            name: "Homebridge".to_string(),
            description: "Adds HomeKit support to your non-HomeKit smart home devices.".to_string(),
            tags: "app, server".to_string(),
            logo: "demo-homebridge.png".to_string(),
            url: "https://homebridge.io".to_string(),
            category_id: Some("utilities".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "unifi".to_string(),
            name: "Unifi".to_string(),
            description: "Network management software solution from Ubiquiti.".to_string(),
            tags: "app, server".to_string(),
            logo: "demo-unifi.png".to_string(),
            url: "https://github.com/k8s-at-home/charts/tree/master/charts/unifi".to_string(),
            category_id: Some("utilities".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
        Service {
            id: "adguard-home".to_string(),
            name: "AdGuard Home".to_string(),
            description: "Network-wide software for blocking ads & tracking.".to_string(),
            tags: "app, server".to_string(),
            logo: "demo-adguard.png".to_string(),
            url: "https://github.com/AdguardTeam/AdGuardHome".to_string(),
            category_id: Some("utilities".to_string()),
            target: "_blank".to_string(),
            created_at: Utc::now(),
        },
    ];

    for service in services {
        service_repo.insert(service)?;
    }

    Ok(())
}
