import { IExperimentDefinition, IExperimentVariantInstance } from "./dtos";
import { HyppotConfiguration } from "./HyppotConfiguration";
import { ExperimentationResolver } from "./resolving/ExperimentationResolver";
import { IExperimentationResolver } from "./resolving/IExperimentationResolver";
import { IExperimentStatusAccessor } from "./resolving/IExperimentStatusAccessor";
import { IResolvedExperiment } from "./resolving/IResolvedExperiment";
import { SessionStorageExperimentStatusAccessor } from "./resolving/SessionStorageExperimentStatusAccessor";
import { ExperimentTracker } from "./tracking/ExperimentTracker";
import { IExperimentTracker } from "./tracking/IExperimentTracker";
import { TrackingApiClient } from "./tracking/TrackingApiClient";
export function configureHyppot(configure: (config: HyppotConfiguration) => void): { resolver: IExperimentationResolver, tracker: IExperimentTracker } {
  const config = new HyppotConfiguration();
  configure(config);
  const tracker = new ExperimentTracker(new TrackingApiClient(config.prefix));
  return {
    resolver: new ExperimentationResolver(new SessionStorageExperimentStatusAccessor(config.prefix, config.experimentStatusKey), tracker),
    tracker: tracker
  };
}

export {
  ExperimentationResolver,
  IExperimentStatusAccessor,
  IExperimentDefinition,
  IExperimentVariantInstance,
  IResolvedExperiment,
  IExperimentationResolver,
  HyppotConfiguration,
  IExperimentTracker
};
