import { Category, Config, Service } from 'server/entities';

const CONFIG: Config = {
  id: '',
  title: '',
  subtitle: '',
  columns: 0,
};

const CATEGORY: Category = {
  name: '',
  description: '',
  icon: 'ActivityLogIcon',
};

const SERVICE: Service = {
  name: '',
  description: '',
  target: '_blank',
  url: '',
  category: CATEGORY,
  logo: 'placeholder.png',
};

const BASE_STATE = { SERVICE, CATEGORY, CONFIG };

export { BASE_STATE };
