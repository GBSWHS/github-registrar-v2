import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github/login')
  async githubLogin(@Res() res: Response) {
    const clientId = this.configService.get('GITHUB_CLIENT_ID');
    const redirectUri = encodeURIComponent(
      'http://localhost:3000/auth/github/callback',
    );
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    return res.redirect(githubAuthUrl);
  }

  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.authService.getAccessTokenFromCode(code);
      const userId =
        await this.authService.getUserIdFromAccessToken(accessToken);

      // 초대 생성 시도
      try {
        await this.authService.createInvitationByUserId(userId);
        return res.redirect('https://github.com/orgs/GBSWHS/invitation');
      } catch (invitationError) {
        console.error('Error creating invitation:', invitationError);
        // 초대 생성 실패 시 사용자에게 알리는 페이지로 리다이렉트
        return res.redirect('/invitation-error');
      }
    } catch (error) {
      console.error('Error during GitHub authentication:', error);
      throw new HttpException(
        'GitHub 인증 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
