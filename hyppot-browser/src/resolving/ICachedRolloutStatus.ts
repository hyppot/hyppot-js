import type { IVariantInstance } from "@hyppot/types";

export interface ICachedRolloutStatus {
  experiments: IVariantInstance[];
  featureToggles: IVariantInstance[];
  user: string;
}
