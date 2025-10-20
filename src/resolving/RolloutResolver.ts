import { HyppotConfiguration } from "../HyppotConfiguration";
import { IRolloutTracker } from "../tracking/IExperimentTracker";
import { IRolloutResolver } from "./IRolloutResolver";
import { IRolloutStatusAccessor } from "./IRolloutStatusAccessor";
import { ResolvedExperiment } from "./ResolvedExperiment";
import { IVariantInstance } from "../dtos";

export class RolloutResolver implements IRolloutResolver {
  private currentUser: string | null = null;
  private _isReady = false;

  constructor(private _statusAccessor: IRolloutStatusAccessor, private _tracker: IRolloutTracker, private _config: HyppotConfiguration) { }

  public get isReady(): boolean {
    return this._isReady;
  }

  public async initialize(userId: string): Promise<void> {
    this._isReady = false;
    this.currentUser = userId;
    await this._statusAccessor.downloadForUser(userId)
      .then(() => {
        this._isReady = true;
      });
  }

  public resolveExperiment(experimentId: string): ResolvedExperiment | null {
    const instance = this.getAllExperiments().filter((e: IVariantInstance) => e.rollout === experimentId);
    const experiment = instance.length ? new ResolvedExperiment(instance[0]) : null;
    if (experiment && this._config.autoTrackImpressions) {
      this._tracker.trackImpression({
        experiment: experimentId,
        variant: experiment.variant,
        eventDate: new Date(),
        user: this.currentUser ?? ''
      });
    }
    return experiment;
  }

  public resolveFeatureToggle(featureToggleId: string): ResolvedExperiment | null {
    const instance = this.getAllFeatureToggles().filter((e: IVariantInstance) => e.rollout === featureToggleId);
    return instance.length ? new ResolvedExperiment(instance[0]) : null;
  }

  // todo: remove method. or document at least that this will not track impressions
  public resolveAll(): ResolvedExperiment[] {
    return this.getAllExperiments().map(e => new ResolvedExperiment(e));
  }

  private getAllExperiments(): IVariantInstance[] {
    const { user, experiments } = this._statusAccessor.get();

    if (this.currentUser !== null && user !== this.currentUser) {
      console.log(`WARNING: cached context is for different user as accessing`);
      this.initialize(this.currentUser);
    }

    return experiments;
  }

  private getAllFeatureToggles(): IVariantInstance[] {
    const { user, featureToggles } = this._statusAccessor.get();

    if (this.currentUser !== null && user !== this.currentUser) {
      console.log(`WARNING: cached context is for different user as accessing`);
      this.initialize(this.currentUser);
    }

    return featureToggles;
  }
}
