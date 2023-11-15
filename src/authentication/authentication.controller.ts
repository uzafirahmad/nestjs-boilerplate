import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './model/user.interface';
import { Request } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.registerUser(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) { 
    return this.authenticationService.loginUser(loginDto);
  }
 
  @Post('verify')
  async verify(@Body() verifyDto: VerifyDto) {
    return this.authenticationService.verify(verifyDto.accesstoken);
  }

  @UseGuards(AuthGuard('login_required'))
  @Get('test')
  async test(@Req() req: Request) {
    return this.authenticationService.authRequired(req);
  }
}
