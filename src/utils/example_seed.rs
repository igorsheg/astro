// use chrono::Utc;
// use sqlx::SqlitePool;
//
// use crate::{
//     domain::{category::Category, client_config::Config},
//     infra::error::AstroError,
// };
//
// pub async fn seed_sample_data(pool: &SqlitePool) -> Result<(), AstroError> {
//     // Create a transaction
//     let mut tx = pool.begin().await.unwrap();
//
//     // Insert sample config
//     let config = Config {
//         id: "default-config".to_string(),
//         title: "Astro".to_string(),
//         subtitle: "Your personal space".to_string(),
//         created_at: Utc::now().naive_utc(),
//         updated_at: Utc::now().naive_utc(),
//     };
//     sqlx::query!(
//         "INSERT INTO config (id, title, subtitle) VALUES (?, ?, ?)",
//         config.id,
//         config.title,
//         config.subtitle
//     )
//     .execute(&mut tx)
//     .await;
//
//     // Insert sample categories
//     let categories = vec![
//         Category {
//             id: "home-media".to_string(),
//             name: "Home Media".to_string(),
//             description: "Global streaming service".to_string(),
//             icon: "VideoIcon".to_string(),
//         },
//         Category {
//             id: "utilities".to_string(),
//             name: "Utilities".to_string(),
//             description: "A movie collection manager for Usenet and BitTorrent users".to_string(),
//             icon: "MixerVerticalIcon".to_string(),
//         },
//     ];
//     for category in categories {
//         sqlx::query!(
//             "INSERT INTO categories (id, name, description, icon) VALUES (?, ?, ?, ?)",
//             category.id,
//             category.name,
//             category.description,
//             category.icon
//         )
//         .execute(&mut tx)
//         .await;
//     }
//
//     // Insert sample services
//     let services = vec![
//         // define services here
//     ];
//
//     for service in services {
//         sqlx::query!("INSERT INTO services (id, name, description, tags, url, logo, category_id, target, created_at, grid_order, grid_w, grid_h) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//             service.id,
//             service.name,
//             service.description,
//             service.tags,
//             service.url,
//             service.logo,
//             service.category_id.unwrap(),
//             service.target,
//             service.created_at,
//             service.grid_details.order,
//             service.grid_details.w,
//             service.grid_details.h)
//             .execute(&mut tx)
//             .await?;
//     }
//
//     // Commit the transaction
//     tx.commit().await.unwrap();
//
//     Ok(())
// }
