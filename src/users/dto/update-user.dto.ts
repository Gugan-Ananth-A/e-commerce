import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName?: string;

    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @IsEmail()
    email?: string;

    @IsString()
    role?: 'ADMIN' | 'CUSTOMER'
}