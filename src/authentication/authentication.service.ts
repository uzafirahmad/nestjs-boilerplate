import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './model/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthenticationService {
  constructor(@InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService
    ) { }

    async registerUser(registerDto: RegisterDto): Promise<User> {
      const { email, password, confirmPassword, username } = registerDto;
    
      // Check if the password and confirmPassword match
      if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
    
      const existingUser = await this.userModel.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new BadRequestException('Email or username already exists');
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        email: email,
        password: hashedPassword,
        username: email, // Note: You are using the email as the username here. Make sure this is intended.
      });
    
      return newUser.save();
    }
    

  async loginUser(loginDto: LoginDto): Promise<{ accessToken: string } | null> {
    const {email,password} = loginDto
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { email: user.email, id: user._id, username:user.username };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    else{
      throw new UnauthorizedException("Invalid email or password")
    }
  }

  async verify(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token); // This will throw an error if the token is invalid or expired
      return !!decoded; // returns true if token is valid
    } catch (error) {
      return false; // returns false if token is invalid
    } 
  } 

  async authRequired(req: Request): Promise<any> {
    const user = req.user;
    return { user };
  }
}
