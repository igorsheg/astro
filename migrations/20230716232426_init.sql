--- Create the config table
CREATE TABLE config (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Create the categories table
CREATE TABLE categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- Create the services table
CREATE TABLE services (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    url TEXT NOT NULL,
    logo TEXT,
    category_id TEXT NOT NULL,
    target TEXT,
    created_at TIMESTAMP NOT NULL,
    grid_order INTEGER NOT NULL,
    grid_w INTEGER NOT NULL,
    grid_h INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Create the uptime_status table
CREATE TABLE uptime_status (
    service_id TEXT NOT NULL,
    checked_at TIMESTAMP NOT NULL,
    uptime BOOLEAN NOT NULL,
    latency INTEGER NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services (id)
);

-- Insert sample config data
INSERT INTO config (id, title, subtitle, created_at, updated_at)
VALUES (
    'default-config',
    'Astro',
    'Your personal space',
    DATETIME('now'),
    DATETIME('now')
);

-- Insert sample category data
INSERT INTO categories (id, name, description, icon)
VALUES ('home-media', 'Home Media', 'Global streaming service', 'VideoIcon');

INSERT INTO categories (id, name, description, icon)
VALUES (
    'utilities',
    'Utilities',
    'A movie collection manager for Usenet and BitTorrent users',
    'MixerVerticalIcon'
);

-- Insert sample service data
INSERT INTO services (id, name, description, tags, url, logo, category_id, target, created_at, grid_order, grid_w, grid_h)
VALUES
    ('plex', 'Plex', 'Global streaming service', 'app, server', 'https://www.plex.tv', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 2, 2, 2),
    ('radarr', 'Radarr', 'A movie collection manager for Usenet and BitTorrent users', 'app, server', 'https://radarr.video', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 3, 1, 1),
    ('sonarr', 'Sonarr', 'A PVR for Usenet and BitTorrent users', 'app, server', 'https://sonarr.tv', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 4, 1, 1),
    ('bazarr', 'Bazarr', 'Manages and downloads subtitles', 'app, server', 'https://www.bazarr.media', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 5, 1, 1),
    ('jackett', 'Jackett', 'API Support for your favorite torrent trackers', 'app, server', 'https://github.com/Jackett/Jackett', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 6, 1, 1),
    ('home-assistant', 'Home Assistant', 'Open source home automation that puts local control and privacy first.', 'app, server', 'https://www.home-assistant.io', 'https://source.boringavatars.com/marble/120', 'utilities', '_blank', DATETIME('now'), 7, 1, 1),
    ('homebridge', 'Homebridge', 'Adds HomeKit support to your non-HomeKit smart home devices.', 'app, server', 'https://homebridge.io', 'https://source.boringavatars.com/marble/120', 'utilities', '_blank', DATETIME('now'), 8, 1, 1),
    ('unifi', 'Unifi', 'Network management software solution from Ubiquiti.', 'app, server', 'https://github.com/k8s-at-home/charts/tree/master/charts/unifi', 'https://source.boringavatars.com/marble/120', 'utilities', '_blank', DATETIME('now'), 9, 1, 1),
    ('adguard-home', 'AdGuard Home', 'Network-wide software for blocking ads & tracking.', 'app, server', 'https://github.com/AdguardTeam/AdGuardHome', 'https://source.boringavatars.com/marble/120', 'utilities', '_blank', DATETIME('now'), 10, 1, 1),
    ('spotify', 'Spotify', 'Music streaming platform', 'app, music', 'https://www.spotify.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 11, 1, 1),
    ('netflix', 'Netflix', 'Video streaming service', 'app, movies, TV shows', 'https://www.netflix.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 12, 1, 1),
    ('github', 'GitHub', 'Development platform', 'app, code, version control', 'https://www.github.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 13, 1, 1),
    ('trello', 'Trello', 'Collaborative project management', 'app, productivity', 'https://www.trello.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 14, 1, 1),
    ('slack', 'Slack', 'Team communication platform', 'app, collaboration', 'https://www.slack.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 15, 1, 1),
    ('wordpress', 'WordPress', 'Content management system', 'app, website', 'https://www.wordpress.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 16, 1, 1),
    ('aws', 'Amazon Web Services', 'Cloud computing platform', 'app, cloud, hosting', 'https://aws.amazon.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 17, 1, 1),
    ('google-drive', 'Google Drive', 'File storage and synchronization', 'app, cloud, storage', 'https://www.google.com/drive/', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 18, 1, 1),
    ('zoom', 'Zoom', 'Video conferencing platform', 'app, communication', 'https://www.zoom.us', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 19, 1, 1),
    ('jira', 'Jira', 'Issue tracking and project management', 'app, development', 'https://www.atlassian.com/software/jira', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 20, 1, 1),
    ('dropbox', 'Dropbox', 'File hosting service', 'app, cloud, storage', 'https://www.dropbox.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 21, 1, 1),
    ('discord', 'Discord', 'Voice, video, and text communication', 'app, gaming', 'https://www.discord.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 22, 1, 1),
    ('twitch', 'Twitch', 'Live streaming platform', 'app, gaming, entertainment', 'https://www.twitch.tv', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 23, 1, 1),
    ('google-maps', 'Google Maps', 'Web mapping service', 'app, maps, navigation', 'https://www.google.com/maps', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 24, 1, 1),
    ('evernote', 'Evernote', 'Note-taking app', 'app, productivity', 'https://www.evernote.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 25, 1, 1),
    ('adobe-creative-cloud', 'Adobe Creative Cloud', 'Creative software suite', 'app, design, multimedia', 'https://www.adobe.com/creativecloud.html', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 26, 1, 1),
    ('airbnb', 'Airbnb', 'Accommodation marketplace', 'app, travel', 'https://www.airbnb.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 27, 1, 1),
    ('reddit', 'Reddit', 'Social news aggregation', 'app, social media, news', 'https://www.reddit.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 28, 1, 1),
    ('shopify', 'Shopify', 'E-commerce platform', 'app, online store', 'https://www.shopify.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 29, 1, 1),
    ('google-docs', 'Google Docs', 'Online word processing', 'app, productivity', 'https://www.google.com/docs', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 30, 1, 1),
    ('instagram', 'Instagram', 'Photo and video sharing', 'app, social media', 'https://www.instagram.com', 'https://source.boringavatars.com/marble/120', 'home-media', '_blank', DATETIME('now'), 31, 1, 1);

