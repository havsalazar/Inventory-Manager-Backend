import { Controller, Request, Post, Logger, Body, Delete } from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,) { }
    private readonly logger = new Logger("AuthController");
    // @UseGuards(AuthGuard('local'))
    // @Post('login')
    // async login(@Body() req) {
    //     this.logger.log("User logged in")
    //     return this.authService.login(req.email);
    // }

    // @Post('signup')
    // async createUser(
    //     @Body('password') password: string,
    //     @Body('email') email: string,

    // ) {
    //     const saltOrRounds = 10;
    //     const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    //     const result = await this.usersService.signup(
    //         email,
    //         hashedPassword,
    //     );
    //     const payload = { email: email, sub: result.id };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    //     // return result;
    // }
    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
      return this.authService.signUp(createUserDto);
    }
  
    @Post('signin')
    signin(@Body() data: AuthDto) {
      return this.authService.signIn(data);
    }
  
    @Delete('logout')
    logout(@Body() req: Request) {
        console.log(req)
      this.authService.logout(req['user']['sub']);
    }
}