import { Category, Config, Service, Theme } from '../entities';

const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 'home-media',
    name: 'Plex',
    description: 'Global streaming service',
  },
  {
    id: 'Utilities',
    name: 'Raddar',
    description: 'A movie collection manager for Usenet and BitTorrent users',
  },
];

const SAMPLE_CONFIG: Config = {
  id: 'defaultConfig',
  title: 'Astro',
  subtitle: 'Your personal space',
  columns: 4,
};

const SAMPLE_SERVICES: Service[] = [
  {
    name: 'Plex',
    description: 'Global streaming service',
    tags: ['app', 'server'],
    url: 'https://www.plex.tv',
    category: 'home-media',
  },
  {
    name: 'Raddar',
    description: 'A movie collection manager for Usenet and BitTorrent users',
    tags: ['app'],
    url: 'https://radarr.video',
    category: 'home-media',
  },
  {
    name: 'Sonnar',
    description: 'A PVR for Usenet and BitTorrent users',
    tags: ['app', 'api'],
    url: 'https://sonarr.tv',
    category: 'home-media',
  },
  {
    name: 'Bazarr',
    description: 'Manages and downloads subtitles',
    tags: ['app'],
    url: 'https://www.bazarr.media',
    category: 'home-media',
  },
  {
    name: 'Jackett',
    description: 'API Support for your favorite torrent trackers',
    tags: ['app', 'api'],
    url: 'https://github.com/Jackett/Jackett',
    category: 'home-media',
  },
];

const dark: Theme = {
  id: 'dark',
  label: 'Dark Theme',
  background: { primary: '#2e2f30', secondary: '#222324' },
  text: { primary: '#FFFFFF', secondary: '#cbcecf' },
  border: { primary: '#4D4E4F', secondary: '#4D4E4F' },
};

const light: Theme = {
  id: 'light',
  label: 'Light Theme',
  background: { primary: '#FFFFFF', secondary: '#F6F7F7' },
  text: { primary: '#000000', secondary: '#696b6c' },
  border: { primary: '#E5E5E5', secondary: '#E5E5E5' },
};

const SAMPLE_THEMES: { dark: Theme; light: Theme } = {
  dark,
  light,
};

export { SAMPLE_CONFIG, SAMPLE_THEMES, SAMPLE_CATEGORIES, SAMPLE_SERVICES };
