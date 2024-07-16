import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/auth/github/login', 302)
  redirectToGithubLogin() {}
}
