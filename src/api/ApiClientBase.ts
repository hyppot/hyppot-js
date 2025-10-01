export class ApiClientBase {
  constructor(private readonly basePath: string) { }

  protected async get<T>(path: string): Promise<T> {
    const response = await fetch(this.formatUrl(path), {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.json() as Promise<T>;
  }
  public post<T>(path: string, body: object): Promise<T> {
    return this.fetch('POST', path, body);
  }

  protected async getPlain(path: string): Promise<string> {
    const response = await fetch(this.formatUrl(path), {
      headers: {
        "Accept": "text/plain"
      }
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response.text();
  }

  private async fetch<T>(method: string, path: string, body: object): Promise<T> {
    const url = this.formatUrl(path);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    }
    return undefined as T;
  }

  private formatUrl(path: string): string {
    return `${this.basePath}/${path.replace(/^\//, '')}`;
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        const errorData = await response.json();

        // Check if it's a validation error response
        if (errorData.title && errorData.errors && response.status === 400) {
          // Format validation errors into a readable message
          const errorMessages: string[] = [];

          for (const [property, messages] of Object.entries(errorData.errors)) {
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                const propertyName = property === "_" ? "General" : property;
                errorMessages.push(`${propertyName}: ${message}`);
              });
            }
          }

          throw new Error(errorMessages.join("; "));
        }

        // Handle other JSON error responses
        if (errorData.title) {
          throw new Error(errorData.title);
        }

        throw new Error(`HTTP request failed: ${response.status}`);
      } catch (parseError) {
        // If JSON parsing fails, fall back to text
        const errorText = await response.text();
        throw new Error(errorText || `HTTP request failed: ${response.status}`);
      }
    } else {
      // Handle non-JSON error responses
      const errorText = await response.text();
      throw new Error(errorText || `HTTP request failed: ${response.status}`);
    }
  }
}
