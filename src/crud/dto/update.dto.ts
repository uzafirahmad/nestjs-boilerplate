import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateDto {
    @IsString({ message: 'Title must be a string' })
    id: string;

    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(255, { message: 'Title cannot exceed 255 characters' })
    title: string;
  
    @IsString({ message: 'Description must be a string' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
    description: string;
}