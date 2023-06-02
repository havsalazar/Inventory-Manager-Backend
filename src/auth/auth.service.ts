import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from './../users/users.service';
// import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

 
    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        // Check if user exists 
        const userExists = await this.usersService.getUserByEmail(
            createUserDto.email,
        );
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        // Hash password
        const hash = await this.hashData(createUserDto.password);
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash,
        });
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.token.refresh_token);
        return tokens;
    }

    async signIn(data: AuthDto) {
        // Check if user exists
        const user = await this.usersService.getUserByEmail(data.email);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.token.refresh_token);
        return tokens;
    }

    async logout(id: string) {
        return this.usersService.update(id, { id, refreshToken: null });
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(id: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(id, {
            id,
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(id: string, email: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_TIME'),
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    email,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_TIME_REFRESH'),
                },
            ),
        ]);

        return {
            token: {
                access_token,
                refresh_token,
            }
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findOne(userId);
        if (!user || !user.refreshToken)
          throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
          user.refreshToken,
          refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.token.refresh_token);
        return tokens;
      }


}