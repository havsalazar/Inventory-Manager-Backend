import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {

  private readonly logger = new Logger("Refresh Token Strategy");
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    // this.logger.log(refreshToken)
    return { ...payload, refreshToken };
    // const refreshToken = request.header('Authorization').split(' ')[1];
    // const tokenId = request.header('Token-Id');

    // return this.authService.getUserIfRefreshTokenMatches(
    //   refreshToken,
    //   tokenId,
    //   payload,
    // );
  }
}