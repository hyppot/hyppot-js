import { ICachedExperimentsStatus } from "./ICachedExperimentsStatus";

export interface IExperimentStatusAccessor {
  downloadForUser(userId: string): Promise<void>;
  get(): ICachedExperimentsStatus;
}
