import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class DeleteOneDto {
    @IsString({ message: 'id must be a string' })
    id: string;
}
