import { IsString, MinLength, MaxLength } from 'class-validator';

export class ReadOneDto {
    @IsString({ message: 'id must be a string' })
    id: string;
}
