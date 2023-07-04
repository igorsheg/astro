import type { RadixIconTypes } from "./radixIconsTypes";

interface Service {
  id?: string;
  name: string;
  description: string;
  url: string;
  logo: string;
  target: string;
  tags: string;
  category_id: string;
  pings?: Ping[];
}

interface Category {
  id?: string;
  name: string;
  description: string;
  icon: RadixIconTypes;
  services?: Service[];
}

interface Note {
  id?: number;
  title: string;
  content: string;
  config?: Config;
}

interface Link {
  id?: number;
  title: string;
  content: string;
  config?: Config;
}

interface Config {
  id?: string;
  title: string;
  subtitle: string;
  columns: number;
  notes?: Note[];
  links?: Link[];
  themes?: Theme[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface Ping {
  id?: string;
  latency: number;
  status_code: number;
  created_at?: Date;
}

interface Theme {
  id: string;
  label: string;
  accent: { primary: string; secondary: string };
  background: { primary: string; secondary: string; ternary: string };
  text: { primary: string; secondary: string };
  border: { primary: string; secondary: string };
  config?: Config;
}

export type { Service, Category, Theme, Note, Config, Link, Ping };
