import { ExperimentApiClient } from "./ExperimentApiClient";
import { IExperimentStatusAccessor } from "./IExperimentStatusAccessor";
import { ICachedExperimentsStatus } from "./ICachedExperimentsStatus";
import { IExperimentVariantInstance } from "../dtos";

export class SessionStorageExperimentStatusAccessor implements IExperimentStatusAccessor {
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
      .catch(error => {
        console.error('Error downloading experiments:', error);
        return "W10="; // Return empty array in base64 as fallback
      })
      .then(data => {
        const encodedData = this.encode(userId, data);
        SessionStorageExperimentStatusAccessor.cachedData = { userId, data };
        this.trySetInSessionStorage(encodedData);
      });
  }

  get(): ICachedExperimentsStatus {
    const fallback = { user: "", experiments: [] };

    if (SessionStorageExperimentStatusAccessor.cachedData) {
      const { userId, data } = SessionStorageExperimentStatusAccessor.cachedData;
      return {
        user: userId,
        experiments: this.decode<IExperimentVariantInstance[]>(data)
      };
    }

    return this.tryGetFromSessionStorage() ?? fallback;
  }

  private tryGetFromSessionStorage(userId?: string): ICachedExperimentsStatus | null {
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
        experiments: this.decode<IExperimentVariantInstance[]>(parts[1])
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
    return `${btoa(userId)},${data}`;
  }

  private hasCachedDataForUser(userId: string): boolean {
    return !!SessionStorageExperimentStatusAccessor.cachedData &&
      SessionStorageExperimentStatusAccessor.cachedData.userId === userId;
  }
}
