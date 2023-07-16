import { Category } from "./category";

export type ServiceGridDetails = {
  order: number;
  w: number; // number of column spans
  h: number; // number of row spans
};
export type UptimeStatus = {
  service_id: string;
  checked_at: string;
  uptime: boolean;
  latency: number;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  tags: string;
  url: string;
  logo: string;
  category_id: string;
  category?: Category;
  target: string;
  status?: UptimeStatus[];
  grid_details: ServiceGridDetails;
};

export type ServiceDetail = {
  id: string;
  details: UptimeStatus[];
};
