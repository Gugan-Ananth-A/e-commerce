import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body(ValidationPipe) body: LoginDto){
        return this.authService.login(body);
    }

    @Post('signup')
    signup(@Body(ValidationPipe) body: SignUpDto){
        return this.authService.signup(body);
    }

    @Post('refresh-token')
    refreshToken(@Body() body: RefreshTokenDto){
        return this.authService.refreshToken(body);
    }

    @Post('logout/:id')
    logout(@Param('id', ValidationPipe) id: string){
        return this.authService.logout(id);
    }
}
