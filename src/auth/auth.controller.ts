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
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('github/login')
  async githubLogin(@Req() req: Request, @Res() res: Response) {
    const allowedIP = this.configService.get<string>('ALLOWED_IP');
    const clientIP = req.ip;
    console.log('allowedIP : ', allowedIP);
    console.log('cliendIP : ', clientIP);

    if (clientIP !== allowedIP) {
      throw new HttpException(
        '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요',
        HttpStatus.FORBIDDEN,
      );
    }

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
    const allowedIP = this.configService.get<string>('ALLOWED_IP');
    const clientIP = req.ip;

    if (clientIP !== allowedIP) {
      throw new HttpException(
        '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const accessToken = await this.authService.getAccessTokenFromCode(code);
      const userId =
        await this.authService.getUserIdFromAccessToken(accessToken);

      try {
        await this.authService.createInvitationByUserId(userId);
        return res.redirect('https://github.com/orgs/GBSWHS/invitation');
      } catch (invitationError) {
        console.error('Error creating invitation:', invitationError);
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
