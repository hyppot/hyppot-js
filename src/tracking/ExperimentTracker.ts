import { IExperimentImpressionModel, IExperimentConversionModel } from "../dtos";
import { IExperimentTracker } from "./IExperimentTracker";
import { TrackingApiClient } from "./TrackingApiClient";


export class ExperimentTracker implements IExperimentTracker {
  constructor(private readonly apiClient: TrackingApiClient) {
  }

  trackImpression(impression: IExperimentImpressionModel): Promise<void> {
    return this.apiClient.trackImpression(impression);
  }

  trackConversion(conversion: IExperimentConversionModel): Promise<void> {
    return this.apiClient.trackConversion(conversion);
  }
}
