import { IExperimentVariantInstance } from "../dtos";
import { IResolvedExperiment } from "./IResolvedExperiment";


export class ResolvedExperiment implements IResolvedExperiment {
  constructor(private result: IExperimentVariantInstance) {
  }

  get experiment(): string {
    return this.result.experiment;
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
}
