import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-local';
import { PassportStrategy} from '@nestjs/passport';
import { Injectable, UnauthorizedException,Logger } from '@nestjs/common';
import { AuthService } from './auth.service'; 
type JwtPayload = {
  sub: string;
  username: string;
};
@Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService, ) {
//     super();
//   }
//   private readonly logger = new Logger("LocalStrategy");

//   // async validate(username: string, password: string): Promise<any> {
//   //   this.logger.log(password);
//   //   const user = await this.authService.validateUser(username, password);
//   //   if (!user) {
//   //     throw new UnauthorizedException();
//   //   }
//   //   return user;
//   // }
//   validate(payload: JwtPayload) {
//     return payload;
//   }
// }
export class LocalStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}