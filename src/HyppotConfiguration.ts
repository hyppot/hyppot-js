export class HyppotConfiguration {
  prefix: string = '/hyppot';
  experimentStatusKey = "Hyppot_Ex";
  configureRequest: (request: any) => void = () => {};
  autoTrackImpressions: boolean = true;
}
