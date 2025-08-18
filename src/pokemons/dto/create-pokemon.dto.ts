import  { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from "class-validator";
import { PokemonType } from '@prisma/client';

export class CreatePokemonDto {
    @ApiProperty({ maxLength: 50 })
    @IsString() @MaxLength(50)  @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: PokemonType })
    @IsEnum(PokemonType)
    type: PokemonType;

    @ApiProperty() @IsNumber() @Min(0)
    height: number;

    @ApiProperty() @IsNumber() @Min(0)
    weight: number;

    @ApiPropertyOptional() @IsOptional() @IsUrl()
    imageUrl?: string;

    @ApiPropertyOptional({ description: 'Habilidades por nombre' })
    @IsOptional() abilities?: string[];
}