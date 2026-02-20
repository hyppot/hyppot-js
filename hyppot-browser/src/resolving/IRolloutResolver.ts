import { IResolvedVariant } from "./IResolvedVariant";

export interface IRolloutResolver {
  initialize(userId: string): Promise<void>;
  resolveExperiment(experimentId: string): IResolvedVariant | null;
  resolveFeatureToggle(featureToggleId: string): IResolvedVariant | null;
  readonly isReady: boolean;
}
