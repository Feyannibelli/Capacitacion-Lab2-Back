import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PokemonsModule } from './pokemons/module/pokemons.module';
import { AbilitiesModule } from './abilities/module/abilities.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        PrismaModule,
        PokemonsModule,
        AbilitiesModule,
    ]
})
export class AppModule {}