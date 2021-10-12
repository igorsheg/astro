import { Category, Config, PingLog, Service, Theme } from '../entities';

const SAMPLE_CONFIG: Config = {
  id: 'default-config',
  title: 'Astro',
  subtitle: 'Your personal space',
  columns: 4,
};

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'home-media',
    name: 'Home Media',
    description: 'Global streaming service',
    icon: 'VideoIcon',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'A movie collection manager for Usenet and BitTorrent users',
    icon: 'MixerVerticalIcon',
  },
];

const SAMPLE_SERVICES: Service[] = [
  {
    name: 'Plex',
    description: 'Global streaming service',
    tags: ['app', 'server'],
    url: 'https://www.plex.tv',
    logo: 'demo-plex.png',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Radarr',
    description: 'A movie collection manager for Usenet and BitTorrent users',
    tags: ['app'],
    url: 'https://radarr.video',
    logo: 'demo-radarr.png',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Sonarr',
    description: 'A PVR for Usenet and BitTorrent users',
    tags: ['app', 'api'],
    url: 'https://sonarr.tv',
    logo: 'demo-sonarr.png',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Bazarr',
    description: 'Manages and downloads subtitles',
    tags: ['app'],
    url: 'https://www.bazarr.media',
    logo: 'demo-bazarr.png',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Jackett',
    description: 'API Support for your favorite torrent trackers',
    tags: ['app', 'api'],
    logo: 'demo-jackett.png',
    url: 'https://github.com/Jackett/Jackett',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Home Assistant',
    description:
      'Open source home automation that puts local control and privacy first.',
    tags: ['automation'],
    logo: 'demo-homeassistant.png',
    url: 'https://www.home-assistant.io',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'Homebridge',
    description: 'Adds HomeKit support to your non-HomeKit smart home devices.',
    tags: ['automation'],
    logo: 'demo-homebridge.png',
    url: 'https://homebridge.io',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'Unifi',
    description: 'Network management software solution from Ubiquiti.',
    tags: ['networking'],
    logo: 'demo-unifi.png',
    url: 'https://github.com/k8s-at-home/charts/tree/master/charts/unifi',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'AdGuard Home',
    description: 'Network-wide software for blocking ads & tracking.',
    tags: ['networking'],
    logo: 'demo-adguard.png',
    url: 'https://github.com/AdguardTeam/AdGuardHome',
    category: SAMPLE_CATEGORIES[1],
  },
];

const SAMPLE_SERVICES_LOG: PingLog[] = [
  { latency: 24, service: SAMPLE_SERVICES[0] },
];

const dark: Theme = {
  id: 'dark',
  label: 'Dark Theme',
  accent: { primary: '#0071e3', secondary: '#147ce5' },
  background: { primary: '#2e2f30', secondary: '#222324', ternary: '#191A1B' },
  text: { primary: '#FFFFFF', secondary: '#cbcecf' },
  border: { primary: '#4D4E4F', secondary: '#4D4E4F' },
};

const light: Theme = {
  id: 'light',
  label: 'Light Theme',
  accent: { primary: '#0071e3', secondary: '#147ce5' },
  background: { primary: '#FFFFFF', secondary: '#F6F7F7', ternary: '#E9EAEA' },
  text: { primary: '#000000', secondary: '#696b6c' },
  border: { primary: '#E5E5E5', secondary: '#E5E5E5' },
};

const SAMPLE_THEMES: { dark: Theme; light: Theme } = {
  dark,
  light,
};

export {
  SAMPLE_CONFIG,
  SAMPLE_THEMES,
  SAMPLE_CATEGORIES,
  SAMPLE_SERVICES,
  SAMPLE_SERVICES_LOG,
};
