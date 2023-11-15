import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'login_required') {
  constructor() {
    super({ 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yourSecretKey', // Replace with your secret key or use a configuration service
    });
  }
 
  async validate(payload: any) {
    return { id: payload.id, username: payload.username, email: payload.email  };
  }
}
