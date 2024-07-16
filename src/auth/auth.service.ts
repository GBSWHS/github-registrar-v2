import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetcherProxy } from '../common/fetcher-proxy';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async getAccessTokenFromCode(code: string): Promise<string> {
    const response = await new FetcherProxy()
      .useBasicHeaders()
      .useGetAccessTokenEndpoint()
      .useJSONPostBody({
        client_id: this.configService.get('CLIENT_ID'),
        client_secret: this.configService.get('CLIENT_SECRET'),
        code,
      })
      .getFetcher()
      .fetch();

    return response.access_token;
  }

  async getUserIdFromAccessToken(accessToken: string): Promise<number> {
    const response = await new FetcherProxy()
      .useBasicHeaders()
      .useGetUserInfoEndpoint()
      .useBearerAuthorization(accessToken)
      .getFetcher()
      .fetch();

    return response.id;
  }

  async createInvitationByUserId(userId: number): Promise<void> {
    await new FetcherProxy()
      .useBasicHeaders()
      .useCreateInvitationEndpoint()
      .useAPITokenAuthorization(this.configService.get('ACCESS_TOKEN')!)
      .useJSONPostBody({
        invitee_id: userId,
        role: 'admin',
      })
      .getFetcher()
      .fetch();
  }
}
