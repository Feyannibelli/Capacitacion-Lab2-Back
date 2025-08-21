import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonType } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListPokemonsQuery {
    @ApiPropertyOptional({ minimum: 1, default: 1 })
    @IsOptional() @IsInt() @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
    @IsOptional() @IsInt() @Min(1) @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'icontains por nombre' })
    @IsOptional() @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: PokemonType })
    @IsOptional() @IsEnum(PokemonType)
    type?: PokemonType;

    @ApiPropertyOptional({
        type: [String],
        description:  'Filtrar por una o varias habilidades (case-insensitive). Ej: abilities=Overgrow&abilities=Blaze',
        example: ['Overgrow', 'Blaze'],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',').map(s => s.trim()).filter(Boolean);
        return undefined;
    })
    abilities?: string[];

    @ApiPropertyOptional({ enum: ['id','name','type'], default: 'id' })
    @IsOptional() @IsIn(['id','name','type'])
    sortBy?: 'id' | 'name' | 'type' = 'id';

    @ApiPropertyOptional({ enum: ['asc','desc'], default: 'asc' })
    @IsOptional() @IsIn(['asc','desc'])
    order?: 'asc' | 'desc' = 'asc';
}
