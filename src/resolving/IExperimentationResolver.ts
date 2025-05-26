import { IResolvedExperiment } from "./IResolvedExperiment";

export interface IExperimentationResolver {
  initialize(userId: string): Promise<void>;
  resolve(experimentId: string): IResolvedExperiment | null;
  resolveAll(): IResolvedExperiment[];
  readonly isReady: boolean;
}
