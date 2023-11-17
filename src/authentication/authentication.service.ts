import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, BlacklistedRefreshToken, RefreshToken } from './model/authentication.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import { RefreshTokenDto } from './dto/token.dto';
import { VerifyDto } from './dto/verify.dto';
import * as randomString from 'randomstring';


@Injectable()
export class AuthenticationService { 
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('RefreshToken') private refreshTokenModel: Model<RefreshToken>,
    @InjectModel('BlacklistedRefreshToken') private blacklistedRefreshTokenModel: Model<BlacklistedRefreshToken>,
    private jwtService: JwtService
  ) {}

    async registerUser(registerDto: RegisterDto): Promise<User> {
      const { email, password, confirmpassword, username } = registerDto;
    
      // Check if the password and confirmPassword match
      if (password !== confirmpassword) {
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
    

  async loginUser(loginDto: LoginDto): Promise<{ accessToken: string, refreshToken:string } | null> {
    const {email,password} = loginDto
    const user = await this.userModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const payload = { email: user.email, id: user._id, username:user.username };
      const refreshTokenString = randomString.generate(192);
      const refreshToken = new this.refreshTokenModel({
        refreshToken: refreshTokenString,
        user: user.id,
        // expires field will be automatically set to 10 days in the future
      }); 

      await refreshToken.save();

      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: refreshTokenString
      };
    }
    else{
      throw new UnauthorizedException("Invalid email or password")
    }
  }

  async verify(verifyDto: VerifyDto): Promise<boolean> {
    const { accesstoken } = verifyDto
    try {
      const decoded = this.jwtService.verify(accesstoken); // This will throw an error if the token is invalid or expired
      return !!decoded; // returns true if token is valid
    } catch (error) {
      return false; // returns false if token is invalid
    } 
  } 

  async refreshToken(tokenDto: RefreshTokenDto): Promise<{ accessToken: string, refreshToken: string }> {
    const { refreshToken } = tokenDto;
  
    // let decoded;
    // try {
    //   decoded = this.jwtService.verify(refreshToken); // Verifying the refresh token
    // } catch (e) {
    //   throw new BadRequestException('Invalid refresh token');
    // }
  
    // Check if the refresh token is blacklisted
    const token = await this.blacklistedRefreshTokenModel.findOne({ token: refreshToken }).exec();
    const isBlacklisted = !!token;
    if (isBlacklisted) {
      throw new BadRequestException('Refresh token is blacklisted');
    }

    const storedToken = await this.refreshTokenModel.findOne({ refreshToken })

    if (!storedToken || storedToken.expires < new Date()) {
      throw new BadRequestException('Refresh token expired or invalid.');
    }
  
    // Assuming you have a method to get user based on ID from the token
    const user = await this.userModel.findById(storedToken.user).exec();
    if (!user) {
      throw new BadRequestException('IUser not found.');
    }
  
    // Generate new tokens
    const payload = { id: user.id, username: user.username, email: user.email };
    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '5m' }); // Access token with 5 minutes expiry
    const newRefreshTokenString = randomString.generate(192);
    // Save the new Refresh Token in the database
    const newRefreshToken = new this.refreshTokenModel({
      refreshToken: newRefreshTokenString,
      user: user.id,
    });
    await newRefreshToken.save();

    // Blacklist the old refresh token
    const blacklistedToken = new this.blacklistedRefreshTokenModel({ token: refreshToken });
    await blacklistedToken.save();

    // Delete the old refresh token from the database
    await this.refreshTokenModel.deleteOne({ refreshToken });
  
    return { 
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenString
    };
  }

  async authRequired(req: Request): Promise<any> {
    const user = req.user;
    return { user };
  }
}
