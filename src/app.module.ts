import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PokemonsModule } from './pokemons/pokemons.module';
import { AbilitiesModule } from './abilities/abilities.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        PrismaModule,
        PokemonsModule,
        AbilitiesModule,
    ]
})
export class AppModule {}