import { Module } from '@nestjs/common';
import { PokemonsController } from './controller/pokemons.controller';
import { PokemonsService } from './service/pokemons.service';
import { PokemonsRepository } from './repository/pokemons.repository';

@Module({
    controllers: [PokemonsController],
    providers: [PokemonsService, PokemonsRepository],
    exports: [PokemonsService],
})
export class PokemonsModule {}