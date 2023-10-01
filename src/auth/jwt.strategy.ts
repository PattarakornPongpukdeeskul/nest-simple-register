import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `${process.env.ACCESS_TOKEN_SECRET}`,
    });
  }

  async validate(payload: JwtPayload) {
    if (+new Date() / 1000 > payload.exp) {
      throw new UnauthorizedException();
    }

    return this.usersService.findById(payload.sub);
  }
}
