import { Category, Config, Service, Theme } from '../entities';

const SAMPLE_CONFIG: Config = {
  id: 'default-config',
  title: 'Astro',
  subtitle: 'Your personal space',
  columns: 4,
  categories: [],
};

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'home-media',
    name: 'Home Media',
    description: 'Global streaming service',
    config: SAMPLE_CONFIG,
    icon: 'VideoIcon',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'A movie collection manager for Usenet and BitTorrent users',
    config: SAMPLE_CONFIG,
    icon: 'MixerVerticalIcon',
  },
];

const SAMPLE_SERVICES: Service[] = [
  {
    name: 'Plex',
    description: 'Global streaming service',
    tags: ['app', 'server'],
    url: 'https://www.plex.tv',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Raddar',
    description: 'A movie collection manager for Usenet and BitTorrent users',
    tags: ['app'],
    url: 'https://radarr.video',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Sonnar',
    description: 'A PVR for Usenet and BitTorrent users',
    tags: ['app', 'api'],
    url: 'https://sonarr.tv',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Bazarr',
    description: 'Manages and downloads subtitles',
    tags: ['app'],
    url: 'https://www.bazarr.media',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Jackett',
    description: 'API Support for your favorite torrent trackers',
    tags: ['app', 'api'],
    url: 'https://github.com/Jackett/Jackett',
    category: SAMPLE_CATEGORIES[0],
  },
  {
    name: 'Home Assistant',
    description:
      'Open source home automation that puts local control and privacy first.',
    tags: ['automation'],
    url: 'https://www.home-assistant.io',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'Homebridge',
    description: 'Adds HomeKit support to your non-HomeKit smart home devices.',
    tags: ['automation'],
    url: 'https://homebridge.io',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'Unifi',
    description: 'Network management software solution from Ubiquiti.',
    tags: ['networking'],
    url: 'https://github.com/k8s-at-home/charts/tree/master/charts/unifi',
    category: SAMPLE_CATEGORIES[1],
  },
  {
    name: 'AdGuard Home',
    description: 'Network-wide software for blocking ads & tracking.',
    tags: ['networking'],
    url: 'https://github.com/AdguardTeam/AdGuardHome',
    category: SAMPLE_CATEGORIES[1],
  },
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

export { SAMPLE_CONFIG, SAMPLE_THEMES, SAMPLE_CATEGORIES, SAMPLE_SERVICES };
