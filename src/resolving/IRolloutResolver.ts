import { IResolvedExperiment } from "./IResolvedExperiment";

export interface IRolloutResolver {
  initialize(userId: string): Promise<void>;
  resolve(experimentId: string): IResolvedExperiment | null;
  resolveAll(): IResolvedExperiment[];
  readonly isReady: boolean;
}
