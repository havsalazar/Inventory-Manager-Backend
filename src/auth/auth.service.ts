import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
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


    // async validateUser(email: string, password: string): Promise<any> {
    //     console.log(email)
    //     const user = await this.usersService.getUserByEmail(email);
    //     if (!user) return null;
    //     const passwordValid = await bcrypt.compare(password, user.password)
    //     if (!user) {
    //         throw new NotAcceptableException('could not find the user');
    //     }
    //     if (user && passwordValid) {
    //         return user;
    //     }
    //     return null;
    // }
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
        return this.usersService.update(id,{id,refreshToken: null});
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(id: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(id, {id,
            refreshToken: hashedRefreshToken,
        });
    }

    async getTokens(id: string, username: string) {
        const [access_token, refresh_token] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: id,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            token:{
                access_token,
                refresh_token,
        }
        };
    }



}