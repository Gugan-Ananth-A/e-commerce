import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

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
    @IsInt({each: true})
    categoryIDs: number[];
}