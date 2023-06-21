import { JwtService } from '@nestjs/jwt';
import { Controller, Post, Logger, Body, Delete, Get, UseGuards, Req, ConsoleLogger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './auth.dto';
import { Public } from 'src/shared/ispublic.metadata';
import { RefreshTokenGuard } from './refreshToken.guard';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')

export class AuthController {
  constructor(private jwtService: JwtService,
    private configService: ConfigService,
    private authService: AuthService,) { }
  private readonly logger = new Logger("AuthController");
  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
  @Public()
  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }
  @Public()
  @Delete('logout')
  logout(@Body() req: Request) {
    console.log(req)
    this.authService.logout(req['user']['sub']);
  }

  // @UseGuards(RefreshTokenGuard)
  @Public()
  @Get('refresh-token')
  async refreshTokens(@Req() req: Request) {
    const { accessToken, refreshToken } = this.extractTokenFromHeader(req)
    let userId = ''
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET')
        }
      );
      req['user'] = { ...payload, refreshToken: refreshToken };
      userId = payload['sub']
    } catch {
      throw new UnauthorizedException();
    }
    // const refreshToken = req.user['refreshToken'];

    return this.authService.refreshTokens(userId, refreshToken);
  }
  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // console.log(type , token)
    if (token && type === 'Bearer') {
        // console.log(JSON.parse(token)['access_token'])
        // const { accessToken, refreshToken } = JSON.parse(token)
        const accessToken =JSON.parse(token)['access_token']
        const refreshToken=JSON.parse(token)['refresh_token']
        return { accessToken,refreshToken  };
    }
    return { accessToken: null, refreshToken: null }
}
}