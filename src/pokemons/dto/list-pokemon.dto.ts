import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonType } from '@prisma/client';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, IsArray } from 'class-validator';
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
        type: [Number],
        description: 'IDs de habilidades. Ej: abilityIds=1,2 o abilityIds=1&abilityIds=2',
        example: [1, 2],
    })
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (value === undefined || value === null) return undefined;
        const raw = Array.isArray(value) ? value : [value];
        const nums = raw.flatMap(v => String(v).split(','))
            .map(s => Number(String(s).trim()))
            .filter(n => Number.isFinite(n));
        return nums.length ? nums : undefined;
    })
    @IsInt({ each: true })
    abilityIds?: number[];

    @ApiPropertyOptional({ enum: ['id','name','type'], default: 'id' })
    @IsOptional() @IsIn(['id','name','type'])
    sortBy?: 'id' | 'name' | 'type' = 'id';

    @ApiPropertyOptional({ enum: ['asc','desc'], default: 'asc' })
    @IsOptional() @IsIn(['asc','desc'])
    order?: 'asc' | 'desc' = 'asc';
}
