-- -------------------------------------------------------------
-- TablePlus 4.3.1(393)
--
-- https://tableplus.com/
--
-- Database: db.sqlite3
-- Generation Time: 2021-10-11 14:20:13.0330
-- -------------------------------------------------------------


CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar, "description" varchar, "icon" varchar NOT NULL DEFAULT ('CircleIcon'), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')));

CREATE TABLE "config" ("id" varchar(200) PRIMARY KEY NOT NULL, "title" varchar(200) NOT NULL, "subtitle" varchar, "columns" integer NOT NULL DEFAULT (4), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')));

CREATE TABLE "link" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "configId" varchar(200), CONSTRAINT "FK_55d7fa26d6b5ab42511c3706ceb" FOREIGN KEY ("configId") REFERENCES "config" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "content" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "configId" varchar(200), CONSTRAINT "FK_fc996a81084b6f60d3b4c6a233d" FOREIGN KEY ("configId") REFERENCES "config" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE "service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar, "url" varchar NOT NULL DEFAULT ('#'), "tags" text, "target" text NOT NULL DEFAULT ('_blank'), "logo" text NOT NULL DEFAULT ('logoPlaceHolder.png'), "categoryId" integer, CONSTRAINT "FK_cb169715cbb8c74f263ba192ca8" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);

CREATE TABLE sqlite_sequence(name,seq);

CREATE TABLE "theme" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar, "accent" text NOT NULL, "background" text NOT NULL, "text" text NOT NULL, "border" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "configId" varchar(200), CONSTRAINT "FK_9dae0a297a6c4bb651c38911768" FOREIGN KEY ("configId") REFERENCES "config" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION);

INSERT INTO "category" ("id", "name", "description", "icon", "createdAt", "updatedAt") VALUES
('1', 'Home Media', 'Global streaming service', 'VideoIcon', '2021-10-11 11:18:47', '2021-10-11 11:18:47'),
('2', 'Utilities', 'A movie collection manager for Usenet and BitTorrent users', 'MixerVerticalIcon', '2021-10-11 11:18:47', '2021-10-11 11:18:47');

INSERT INTO "config" ("id", "title", "subtitle", "columns", "createdAt", "updatedAt") VALUES
('default-config', 'Astro', 'Your personal space', '4', '2021-10-11 11:18:47', '2021-10-11 11:18:47');

INSERT INTO "service" ("id", "name", "description", "url", "tags", "target", "logo", "categoryId") VALUES
('1', 'Plex', 'Global streaming service', 'https://www.plex.tv', 'app,server', '_blank', 'demo-plex.png', '1'),
('2', 'Radarr', 'A movie collection manager for Usenet and BitTorrent users', 'https://radarr.video', 'app', '_blank', 'demo-radarr.png', '1'),
('3', 'Sonarr', 'A PVR for Usenet and BitTorrent users', 'https://sonarr.tv', 'app,api', '_blank', 'demo-sonarr.png', '1'),
('4', 'Bazarr', 'Manages and downloads subtitles', 'https://www.bazarr.media', 'app', '_blank', 'demo-bazarr.png', '1'),
('5', 'Jackett', 'API Support for your favorite torrent trackers', 'https://github.com/Jackett/Jackett', 'app,api', '_blank', 'demo-jackett.png', '1'),
('6', 'Home Assistant', 'Open source home automation that puts local control and privacy first.', 'https://www.home-assistant.io', 'automation', '_blank', 'demo-homeassistant.png', '2'),
('7', 'Homebridge', 'Adds HomeKit support to your non-HomeKit smart home devices.', 'https://homebridge.io', 'automation', '_blank', 'demo-homebridge.png', '2'),
('8', 'Unifi', 'Network management software solution from Ubiquiti.', 'https://github.com/k8s-at-home/charts/tree/master/charts/unifi', 'networking', '_blank', 'demo-unifi.png', '2'),
('9', 'AdGuard Home', 'Network-wide software for blocking ads & tracking.', 'https://github.com/AdguardTeam/AdGuardHome', 'networking', '_blank', 'demo-adguard.png', '2');

INSERT INTO "sqlite_sequence" ("name", "seq") VALUES
('service', '9'),
('link', '0'),
('note', '0'),
('category', '2');

INSERT INTO "theme" ("id", "label", "accent", "background", "text", "border", "createdAt", "updatedAt", "configId") VALUES
('dark', 'Dark Theme', '{"primary":"#0071e3","secondary":"#147ce5"}', '{"primary":"#2e2f30","secondary":"#222324","ternary":"#191A1B"}', '{"primary":"#FFFFFF","secondary":"#cbcecf"}', '{"primary":"#4D4E4F","secondary":"#4D4E4F"}', '2021-10-11 11:18:47', '2021-10-11 11:18:47', NULL),
('light', 'Light Theme', '{"primary":"#0071e3","secondary":"#147ce5"}', '{"primary":"#FFFFFF","secondary":"#F6F7F7","ternary":"#E9EAEA"}', '{"primary":"#000000","secondary":"#696b6c"}', '{"primary":"#E5E5E5","secondary":"#E5E5E5"}', '2021-10-11 11:18:47', '2021-10-11 11:18:47', NULL);

