import { IsString } from 'class-validator';

export class VerifyDto {
  @IsString()
  accesstoken: string;
}
