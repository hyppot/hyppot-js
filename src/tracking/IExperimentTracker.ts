import { IExperimentConversionModel, IExperimentImpressionModel } from "../dtos";

export interface IRolloutTracker {
  trackImpression(impression: IExperimentImpressionModel): Promise<void>;
  trackConversion(conversion: IExperimentConversionModel): Promise<void>;
}
