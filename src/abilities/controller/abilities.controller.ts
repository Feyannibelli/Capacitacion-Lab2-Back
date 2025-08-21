import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AbilitiesService } from '../service/abilities.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('abilities')
@Controller('abilities')
export class AbilitiesController {
    constructor(private readonly service: AbilitiesService) {}

    @Get()
    @ApiOkResponse({ description: 'List abilities (filter by ids optional)' })
    @ApiQuery({
        name: 'ids',
        required: false,
        schema: {
            oneOf: [
                { type: 'string', example: '1,2' },
                { type: 'array', items: { type: 'integer' }, example: [1, 2] }
            ]
        }
    })
    list(@Query('ids') ids?: string | string[]) {
        const raw = ids === undefined ? undefined : (Array.isArray(ids) ? ids : [ids]);
        const parsed = raw?.flatMap(v => String(v).split(','))
            .map(s => Number(String(s).trim()))
            .filter(n => Number.isFinite(n));
        return this.service.getAbilitiesByIds(parsed?.length ? parsed : undefined);
    }

    // GET /abilities/:id
    @Get(':id')
    @ApiOkResponse()
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.getAbilityById(id);
    }
}
