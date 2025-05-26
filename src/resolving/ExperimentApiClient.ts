import { ApiClientBase } from "../api/ApiClientBase";


export class ExperimentApiClient extends ApiClientBase {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getForUser(userId: string): Promise<string> {
    return super.getPlain(`?userId=${userId}`);
  }
}

