import { ServiceGridDetails } from "../../models/service";

export interface ResizingService extends Omit<ServiceGridDetails, "order"> {
  id: string;
}
