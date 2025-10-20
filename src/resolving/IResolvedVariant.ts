export interface IResolvedVariant {
  get rollout(): string;
  get variant(): string;
  getVariableValue(name: string): string | number | boolean | null;
}
