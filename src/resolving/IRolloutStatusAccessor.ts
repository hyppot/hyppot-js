import { ICachedRolloutStatus } from "./ICachedRolloutStatus";

export interface IRolloutStatusAccessor {
  downloadForUser(userId: string): Promise<void>;
  get(): ICachedRolloutStatus;
}
