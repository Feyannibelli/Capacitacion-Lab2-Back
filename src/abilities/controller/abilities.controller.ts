import { Controller, Get, Query } from '@nestjs/common';
import { AbilitiesService } from '../service/abilities.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('abilities')
@Controller()
export class AbilitiesController {
    constructor(private readonly service: AbilitiesService) {}

    @Get('abilities')
    @ApiOkResponse({ description: 'List abilities (filter by name)' })
    @ApiQuery({ name: 'name', required: false })
    list(@Query('name') name?: string) {
        return this.service.getAbilitiesByName(name);
    }

    @Get('abilities/pokemons')
    @ApiOkResponse({ description: 'Get all pokemons with a given ability name' })
    @ApiQuery({ name: 'ability', required: true })
    getByAbility(@Query('ability') ability: string) {
        return this.service.getPokemonsByAbility(ability);
    }
}