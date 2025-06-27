import { IExperimentVariantInstance } from "../dtos";
import { IExperimentStatusAccessor } from "./IExperimentStatusAccessor";
import { ResolvedExperiment } from "./ResolvedExperiment";
import { IExperimentationResolver } from "./IExperimentationResolver";
import { IExperimentTracker } from "../tracking/IExperimentTracker";
import { HyppotConfiguration } from "../HyppotConfiguration";

export class ExperimentationResolver implements IExperimentationResolver {
  private currentUser: string | null = null;
  private _isReady = false;

  constructor(private _statusAccessor: IExperimentStatusAccessor, private _tracker: IExperimentTracker, private _config: HyppotConfiguration) {}

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

  public resolve(experimentId: string): ResolvedExperiment | null {
    const instance = this.getAllExperiments().filter(e => e.experiment === experimentId);
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

  // todo: remove method. or document at least that this will not track impressions
  public resolveAll(): ResolvedExperiment[] {
    return this.getAllExperiments().map(e => new ResolvedExperiment(e));
  }

  private getAllExperiments(): IExperimentVariantInstance[] {
    const {user, experiments} = this._statusAccessor.get();

    if (this.currentUser !== null && user !== this.currentUser) {
      console.log(`WARNING: cached context is for different user as accessing`);
      this.initialize(this.currentUser);
    }

    return experiments;
  }
}
