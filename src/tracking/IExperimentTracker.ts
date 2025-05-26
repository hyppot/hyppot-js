import { IExperimentConversionModel, IExperimentImpressionModel } from "../dtos";

export interface IExperimentTracker {
  trackImpression(impression: IExperimentImpressionModel): Promise<void>;
  trackConversion(conversion: IExperimentConversionModel): Promise<void>;
}