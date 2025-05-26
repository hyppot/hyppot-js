export interface IResolvedExperiment {
  get experiment(): string;
  get variant(): string;
  getVariableValue(name: string): string | number | boolean | null;
}
