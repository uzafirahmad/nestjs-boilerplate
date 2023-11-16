import { IsString, Matches } from 'class-validator';

export class VerifyDto {
  @IsString()
  @Matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/, {
    message: 'Invalid access token format',
  })
  accesstoken: string;
}
