import type { IExperimentImpressionModel, IExperimentConversionModel } from "@hyppot/types";
import { IRolloutTracker } from "./IExperimentTracker";
import { TrackingApiClient } from "./TrackingApiClient";

export class RolloutTracker implements IRolloutTracker {
  constructor(private readonly apiClient: TrackingApiClient) {
  }

  trackImpression(impression: IExperimentImpressionModel): Promise<void> {
    return this.apiClient.trackImpression(impression);
  }

  trackConversion(conversion: IExperimentConversionModel): Promise<void> {
    return this.apiClient.trackConversion(conversion);
  }
}
