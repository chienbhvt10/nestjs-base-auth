import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from 'src/config';
import { ErrorData } from 'src/common/error.models';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const user = await this.userService.findOne(payload.username);
    this.checkRole(user.role, req.requiredRoles);
    return user;
  }

  checkRole(currentRole: string, requiredRoles: string[] = []) {
    const isValidRole =
      requiredRoles?.includes(currentRole) || requiredRoles?.length === 0;
    if (!isValidRole) {
      throw ErrorData.Forbidden.permission_denined({
        inputRole: currentRole,
        requireRole: requiredRoles,
      });
    }
  }
}
