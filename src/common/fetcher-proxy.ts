import { Fetcher } from './fetcher';

export class FetcherProxy {
  private readonly fetcher: Fetcher = new Fetcher();

  public getFetcher(): Fetcher {
    return this.fetcher;
  }

  public useBasicHeaders(): this {
    this.useJSONAcceptHeader();
    this.useUserAgentHeader();
    return this;
  }

  private useJSONAcceptHeader(): void {
    this.fetcher.setHeader('Accept', 'application/json');
  }

  private useUserAgentHeader(): void {
    this.fetcher.setHeader(
      'User-Agent',
      'GBSWHS github-registrar (https://github.com/GBSWHS/github-registrar)',
    );
  }

  public useGetAccessTokenEndpoint(): this {
    this.fetcher.setURL('https://github.com/login/oauth/access_token');
    return this;
  }

  public useGetUserInfoEndpoint(): this {
    this.fetcher.setURL('https://api.github.com/user');
    return this;
  }

  public useCreateInvitationEndpoint(): this {
    this.fetcher.setURL('https://api.github.com/orgs/GBSWHS/invitations');
    return this;
  }

  public useBearerAuthorization(bearerToken: string): this {
    this.fetcher.setHeader('Authorization', `bearer ${bearerToken}`);
    return this;
  }

  public useAPITokenAuthorization(apiToken: string): this {
    this.fetcher.setHeader('Authorization', `token ${apiToken}`);
    return this;
  }

  public useJSONPostBody(body: any): this {
    this.fetcher.setMethod('POST');
    this.fetcher.setHeader('Content-Type', 'application/json');
    this.fetcher.setJSONBody(body);
    return this;
  }
}
