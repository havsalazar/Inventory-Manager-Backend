import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/shared/ispublic.metadata';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger("AuthGuard");
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const { accessToken, refreshToken } = this.extractTokenFromHeader(request);
        if (!accessToken) {
            throw new UnauthorizedException();
        }
        try {
            // this.logger.log(process.env.JWT_SECRET)
            const payload = await this.jwtService.verifyAsync(
                accessToken,
                {
                    // secret: process.env.JWT_SECRET
                    secret: this.configService.get<string>('JWT_SECRET')
                }
            );
            request['user'] = { ...payload, refreshToken: refreshToken };
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        const documentationUrl = `${this.configService.get<string>('URL')}/documentation`

        if (token && type === 'Bearer') {
            /*This only works for documentation url(swagger) */
            if (request.headers.referer === documentationUrl) {
                
                return { accessToken: token, refreshToken: '' };

            } else {
                const accessToken = JSON.parse(token)['access_token']
                const refreshToken = JSON.parse(token)['refresh_token']
                return { accessToken, refreshToken };
            }

        }
        return { accessToken: null, refreshToken: null }
    }
}