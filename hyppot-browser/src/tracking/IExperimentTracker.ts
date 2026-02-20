import type { IExperimentConversionModel, IExperimentImpressionModel } from "@hyppot/types";

export interface IRolloutTracker {
  trackImpression(impression: IExperimentImpressionModel): Promise<void>;
  trackConversion(conversion: IExperimentConversionModel): Promise<void>;
}
