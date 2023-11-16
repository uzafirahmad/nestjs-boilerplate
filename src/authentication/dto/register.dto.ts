import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain at least one special character',
  })
  confirmPassword: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}
