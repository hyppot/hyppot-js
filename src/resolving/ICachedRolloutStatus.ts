import { IVariantInstance } from "../dtos";

export interface ICachedRolloutStatus {
  experiments: IVariantInstance[];
  featureToggles: IVariantInstance[];
  user: string;
}
