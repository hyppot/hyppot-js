import { IExperimentVariantInstance } from "./dtos";

export interface ICachedExperimentsStatus {
  experiments: IExperimentVariantInstance[];
  user: string;
}
