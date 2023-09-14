import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from './auths/decorators/public.decorator';
import { LocalAuthGuard } from './auths/guards/local-auth.guard';
import { AuthService } from './auths/services/auth.service';
import { ROLE, Roles } from './auths/decorators/roles.decorator';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @Roles(ROLE.ADMIN)
  getProfile(@Request() req) {
    return req.user;
  }
}
