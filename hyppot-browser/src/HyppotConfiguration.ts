export class HyppotConfiguration {
  prefix: string = '/hyppot';
  baseUrl: string = 'http://localhost:8080';
  experimentStatusKey = "Hyppot_Ex";
  configureRequest: (request: any) => void = () => {};
  autoTrackImpressions: boolean = true;
}
