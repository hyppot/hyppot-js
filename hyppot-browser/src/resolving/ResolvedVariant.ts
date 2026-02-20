import type { IVariantInstance } from "@hyppot/types";
import { HyppotConstants } from "../HyppotConstants";
import { IResolvedVariant } from "./IResolvedVariant";

export class ResolvedVariant implements IResolvedVariant {
  constructor(private result: IVariantInstance) {
  }

  get rollout(): string {
    return this.result.rollout;
  }

  get variant(): string {
    return this.result.variant;
  }

  getVariableValue(name: string): string | number | boolean | null {
    const value = (this.result).variables.filter(v => v.name === name)[0]?.value;

    if(value === undefined) {
      return null;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      return value;
    }

    throw new Error(`Variable ${name} is neither a string, number, boolean, nor null`);
  }

  get isEnabled(): boolean {
    return this.result.variant !== HyppotConstants.FeatureToggleOffVariant;
  }
}
