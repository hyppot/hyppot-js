export class ApiClientBase {
  constructor(private readonly basePath: string) { }

  protected async get<T>(path: string): Promise<T> {
    const response = await fetch(this.formatUrl(path), {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.status}`);
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
      throw new Error(`HTTP request failed: ${response.status}`);
    }

    return response.text();
  }

  private fetch<T>(method: string, path: string, body: object): Promise<T> {
    const url = this.formatUrl(path);

    return fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(body),
    })
      .then(r => {
        if (r.ok) return r;
        else throw Error(`HTTP request failed: ${r.status} ${r.statusText}`);
      })
      .then(r => {
        const contentType = r.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return r.json();
        }
        else return;
      });
  }

  private formatUrl(path: string): string {
    return `${this.basePath}/${path.replace(/^\//, '')}`;
  }
}
