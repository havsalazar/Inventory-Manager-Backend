import { RefreshTokenStrategy } from './refreshToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './../users/users.module';
import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from "./../users/users.service";
import { LocalStrategy } from './local.auth';
import { User } from "src/users/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.register({}),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: configService.get<string>('JWT_TIME') },
    //   }),
    //   inject: [ConfigService]


    // }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService, UsersService, LocalStrategy,RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {
}