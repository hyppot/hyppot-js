import { IVariantInstance } from "../dtos";

export interface ICachedRolloutStatus {
  experiments: IVariantInstance[];
  user: string;
}
