import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PokemonsService } from "../service/pokemons.service";
import { CreatePokemonDto } from "../dto/create-pokemon.dto";
import { UpdatePokemonDto } from "../dto/update-pokemon.dto";
import { ListPokemonsQuery } from "../dto/list-pokemon.dto";
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiSecurity,
    ApiQuery
} from '@nestjs/swagger';
import { ApiKeyGuard } from "../../shared/api-key.guard";

@ApiTags('pokemons')
@Controller('pokemons')
export class PokemonsController {
    constructor(private readonly service: PokemonsService) {}

    @Post()
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('api-key')
    @ApiCreatedResponse({ description: 'Pokemon created' })
    @ApiConflictResponse({ description: 'Duplicate name' })
    @ApiBadRequestResponse({ description: 'Validation error' })
    @ApiUnauthorizedResponse()
    create(@Body() dto: CreatePokemonDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOkResponse({ description: 'List with pagination envelope' })
    list(@Query() q: ListPokemonsQuery) {
        return this.service.findAll(q);
    }

    @Get(':id')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    get(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('api-key')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @ApiConflictResponse()
    @ApiUnauthorizedResponse()
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePokemonDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(ApiKeyGuard)
    @ApiSecurity('api-key')
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @ApiUnauthorizedResponse()
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Get('abilities')
    @ApiOkResponse({ description: 'Listar pokemons filtrando por IDs de habilidades' })
    @ApiQuery({
        name: 'abilityIds',
        required: true,
        schema: {
            oneOf: [
                { type: 'string', example: '1,2' },
                { type: 'array', items: { type: 'integer' }, example: [1, 2] }
            ]
        }
    })
    listByAbilityIds(@Query('abilityIds') abilityIds: string | string[]) {
        const raw = Array.isArray(abilityIds) ? abilityIds : [abilityIds];
        const ids = raw
            .flatMap(v => String(v).split(','))
            .map(s => Number(String(s).trim()))
            .filter(n => Number.isFinite(n));
        return this.service.findAll({ abilityIds: ids, page: 1, limit: 10 });
    }
}
