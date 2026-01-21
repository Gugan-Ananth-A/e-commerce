import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    stock: number;

    @IsArray()
    @ArrayNotEmpty()
    categoryIDs: number[];
}