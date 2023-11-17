import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { BlacklistedRefreshTokenSchema, RefreshTokenSchema, UserSchema } from './model/authentication.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', // Use an environment variable for the secret in production
      signOptions: { expiresIn: '5m' }, // acessToken expires in 5 mins
    }),
    MongooseModule.forFeature([
      { name: 'RefreshToken', schema: RefreshTokenSchema },
      { name: 'User', schema: UserSchema },
      { name: 'BlacklistedRefreshToken', schema: BlacklistedRefreshTokenSchema }
    ])
  ],
  controllers: [AuthenticationController],
  providers: [JwtStrategy, AuthenticationService],
})
export class AuthenticationModule {}
