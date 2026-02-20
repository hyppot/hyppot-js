import type { IExperimentDefinition, IVariantInstance } from "@hyppot/types";
import { HyppotConfiguration } from "./HyppotConfiguration";
import { RolloutResolver } from "./resolving/RolloutResolver";
import { IRolloutResolver } from "./resolving/IRolloutResolver";
import { IRolloutStatusAccessor } from "./resolving/IRolloutStatusAccessor";
import { IResolvedVariant } from "./resolving/IResolvedVariant";
import { SessionStorageRolloutStatusAccessor } from "./resolving/SessionStorageRolloutStatusAccessor";
import { RolloutTracker } from "./tracking/ExperimentTracker";
import { IRolloutTracker } from "./tracking/IExperimentTracker";
import { TrackingApiClient } from "./tracking/TrackingApiClient";
export function configureHyppot(configure: (config: HyppotConfiguration) => void): { resolver: IRolloutResolver, tracker: IRolloutTracker } {
  const config = new HyppotConfiguration();
  configure(config);
  var baseUrl = new URL(config.baseUrl + config.prefix).toString();
  const tracker = new RolloutTracker(new TrackingApiClient(baseUrl));
  return {
    resolver: new RolloutResolver(new SessionStorageRolloutStatusAccessor(baseUrl, config.experimentStatusKey), tracker, config),
    tracker: tracker
  };
}

export {
  RolloutResolver,
  HyppotConfiguration
};

export type {
  IRolloutStatusAccessor,
  IExperimentDefinition,
  IVariantInstance,
  IResolvedVariant,
  IRolloutResolver,
  IRolloutTracker
};
