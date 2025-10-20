import { ExperimentApiClient } from "./ExperimentApiClient";
import { IRolloutStatusAccessor } from "./IRolloutStatusAccessor";
import { ICachedRolloutStatus } from "./ICachedRolloutStatus";
import { IVariantInstance } from "../dtos";

export class SessionStorageRolloutStatusAccessor implements IRolloutStatusAccessor {
  private readonly apiClient: ExperimentApiClient;
  private static cachedData: { userId: string, data: string } | null = null;

  constructor(baseUrl: string, private experimentStatusKey: string) {
    this.apiClient = new ExperimentApiClient(baseUrl);
  }

  downloadForUser(userId: string): Promise<void> {
    if (this.hasCachedDataForUser(userId)) {
        return Promise.resolve();
    }

    const sessionData = this.tryGetFromSessionStorage(userId);
    if (sessionData) {
      return Promise.resolve();
    }

    return this.apiClient.getForUser(userId)
      .then(data => {
        const encodedData = this.encode(userId, data);
        SessionStorageRolloutStatusAccessor.cachedData = { userId, data };
        this.trySetInSessionStorage(encodedData);
      })
      .catch(error => {
        console.error('Error downloading experiments:', error);
      });
  }

  get(): ICachedRolloutStatus {
    const fallback: ICachedRolloutStatus = { user: "", experiments: [], featureToggles: [] };

    if (SessionStorageRolloutStatusAccessor.cachedData) {
      const { userId, data } = SessionStorageRolloutStatusAccessor.cachedData;
      const parts = data.split('.');
      if (parts.length < 2) {
        return fallback;
      }

      return {
        user: userId,
        experiments: this.decode<IVariantInstance[]>(parts[0]),
        featureToggles: this.decode<IVariantInstance[]>(parts[1])
      };
    }

    return this.tryGetFromSessionStorage() ?? fallback;
  }

  private tryGetFromSessionStorage(userId?: string): ICachedRolloutStatus | null {
    try {
      const storedData = window.sessionStorage?.getItem(this.experimentStatusKey);

      if (!storedData) {
        return null;
      }

      const parts = storedData.split(',');
      if (parts.length < 2) {
        return null;
      }

      const storedUserId = atob(parts[0]);

      if (userId && storedUserId !== userId) {
        return null;
      }

      return {
        user: storedUserId,
        experiments: this.decode<IVariantInstance[]>(parts[1]),
        featureToggles: []
      };
    } catch {
      // Treat as no data if someone tampered with the session storage
      return null;
    }
  }

  private trySetInSessionStorage(data: string): void {
    try {
      if (window.sessionStorage) {
        window.sessionStorage.setItem(this.experimentStatusKey, data);
      }
    } catch {
      // Silently fail if session storage is not available
    }
  }

  private decode<T>(encoded: string): T {
    return JSON.parse(atob(encoded)) as T;
  }

  private encode(userId: string, data: string): string {
    return `${btoa(userId)}.${data}`;
  }

  private hasCachedDataForUser(userId: string): boolean {
    return !!SessionStorageRolloutStatusAccessor.cachedData &&
      SessionStorageRolloutStatusAccessor.cachedData.userId === userId;
  }
}
