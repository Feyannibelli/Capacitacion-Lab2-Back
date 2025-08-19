import { Module } from '@nestjs/common';
import { PokemonsService} from "../service/pokemons.service";
import { PokemonsController} from "../controller/pokemons.controller";

@Module({
    controllers: [PokemonsController],
    providers: [PokemonsService],
})
export class PokemonsModule {}