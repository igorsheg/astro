import { Category, Config, Service, Theme } from "../types";

interface SampleCategory extends Category {
  id: string;
}

const SAMPLE_CONFIG: Config = {
  id: "default-config",
  title: "Astro",
  subtitle: "Your personal space",
  columns: 4,
};

const SAMPLE_CATEGORIES: SampleCategory[] = [
  {
    id: "home-media",
    name: "Home Media",
    description: "Global streaming service",
    icon: "VideoIcon",
  },
  {
    id: "utilities",
    name: "Utilities",
    description: "A movie collection manager for Usenet and BitTorrent users",
    icon: "MixerVerticalIcon",
  },
];

const SAMPLE_SERVICES: Service[] = [
  {
    name: "Plex",
    description: "Global streaming service",
    tags: "app, server",
    url: "https://www.plex.tv",
    logo: "demo-plex.png",
    category_id: SAMPLE_CATEGORIES[0].id,
    target: "_blank",
  },
  {
    name: "Radarr",
    description: "A movie collection manager for Usenet and BitTorrent users",
    tags: "app, server",
    url: "https://radarr.video",
    logo: "demo-radarr.png",
    category_id: SAMPLE_CATEGORIES[0].id,
    target: "_blank",
  },
  {
    name: "Sonarr",
    description: "A PVR for Usenet and BitTorrent users",
    tags: "app, server",
    url: "https://sonarr.tv",
    logo: "demo-sonarr.png",
    category_id: SAMPLE_CATEGORIES[0].id,
    target: "_blank",
  },
  {
    name: "Bazarr",
    description: "Manages and downloads subtitles",
    tags: "app, server",
    url: "https://www.bazarr.media",
    logo: "demo-bazarr.png",
    category_id: SAMPLE_CATEGORIES[0].id,
    target: "_blank",
  },
  {
    name: "Jackett",
    description: "API Support for your favorite torrent trackers",
    tags: "app, server",
    logo: "demo-jackett.png",
    url: "https://github.com/Jackett/Jackett",
    category_id: SAMPLE_CATEGORIES[0].id,
    target: "_blank",
  },
  {
    name: "Home Assistant",
    description:
      "Open source home automation that puts local control and privacy first.",
    tags: "app, server",
    logo: "demo-homeassistant.png",
    url: "https://www.home-assistant.io",
    category_id: SAMPLE_CATEGORIES[1].id,
    target: "_blank",
  },
  {
    name: "Homebridge",
    description: "Adds HomeKit support to your non-HomeKit smart home devices.",
    tags: "app, server",
    logo: "demo-homebridge.png",
    url: "https://homebridge.io",
    category_id: SAMPLE_CATEGORIES[1].id,
    target: "_blank",
  },
  {
    name: "Unifi",
    description: "Network management software solution from Ubiquiti.",
    tags: "app, server",
    logo: "demo-unifi.png",
    url: "https://github.com/k8s-at-home/charts/tree/master/charts/unifi",
    category_id: SAMPLE_CATEGORIES[1].id,
    target: "_blank",
  },
  {
    name: "AdGuard Home",
    description: "Network-wide software for blocking ads & tracking.",
    tags: "app, server",
    logo: "demo-adguard.png",
    url: "https://github.com/AdguardTeam/AdGuardHome",
    category_id: SAMPLE_CATEGORIES[1].id,
    target: "_blank",
  },
];

const dark: Theme = {
  id: "dark",
  label: "Dark Theme",
  accent: { primary: "#0071e3", secondary: "#147ce5" },
  background: { primary: "#2e2f30", secondary: "#222324", ternary: "#191A1B" },
  text: { primary: "#FFFFFF", secondary: "#cbcecf" },
  border: { primary: "#4D4E4F", secondary: "#4D4E4F" },
};

const light: Theme = {
  id: "light",
  label: "Light Theme",
  accent: { primary: "#0071e3", secondary: "#147ce5" },
  background: { primary: "#FFFFFF", secondary: "#F6F7F7", ternary: "#E9EAEA" },
  text: { primary: "#000000", secondary: "#696b6c" },
  border: { primary: "#E5E5E5", secondary: "#E5E5E5" },
};

const SAMPLE_THEMES: { dark: Theme; light: Theme } = {
  dark,
  light,
};

export { SAMPLE_CONFIG, SAMPLE_THEMES, SAMPLE_CATEGORIES, SAMPLE_SERVICES };
