import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HtmlExceptionFilter } from '../exception/html-exception.filter';

@ApiTags('Auth')
@UseFilters(HtmlExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private getClientIP(req: Request): string {
    const ip = req.ip;
    // IPv6 형식인 경우 IPv4로 변환
    return ip.substr(0, 7) == '::ffff:' ? ip.substr(7) : ip;
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 403,
    description:
      '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요',
  })
  @ApiOperation({ summary: 'Github Login' })
  @Get('github/login')
  async githubLogin(@Req() req: Request, @Res() res: Response) {
    const allowedIP = this.configService.get<string>('ALLOWED_IP');
    const clientIP = this.getClientIP(req);
    console.log('allowedIP : ', allowedIP);
    console.log('cliendIP : ', clientIP);

    if (clientIP !== allowedIP) {
      throw new HttpException(
        '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요',
        HttpStatus.FORBIDDEN,
      );
    }
    const serverUrl = this.configService.get<string>('SERVER_URL');
    const clientId = this.configService.get('CLIENT_ID');
    const redirectUri = encodeURIComponent(`${serverUrl}/auth/github/callback`);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    return res.redirect(githubAuthUrl);
  }

  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 403,
    description:
      '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요',
  })
  @ApiOperation({ summary: 'Github Callback' })
  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const allowedIP = this.configService.get<string>('ALLOWED_IP');
    const clientIP = this.getClientIP(req);

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
