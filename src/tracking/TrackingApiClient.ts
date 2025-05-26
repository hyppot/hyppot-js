import { ApiClientBase } from "../api/ApiClientBase";
import { IExperimentConversionModel, IExperimentImpressionModel } from "../dtos";

export class TrackingApiClient extends ApiClientBase {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async trackImpression(impression: IExperimentImpressionModel): Promise<void> {
        return this.post<void>(`track/impression`, impression);
    }

    async trackConversion(conversion: IExperimentConversionModel): Promise<void> {
        return this.post<void>(`track/conversion`, conversion);
    }
}
