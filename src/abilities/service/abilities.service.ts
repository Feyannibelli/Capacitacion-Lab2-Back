import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AbilitiesService {
    constructor(private prisma: PrismaService) {}

    getAbilitiesByName(name?: string) {
        return this.prisma.ability.findMany({
            where: name ? { name: { contains: name, mode: 'insensitive' } } : {},
            orderBy: { name: 'asc' },
        });
    }

    async getPokemonsByAbility(name: string) {
        const ability = await this.prisma.ability.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
        if (!ability) throw new NotFoundException("Ability not found");

        const pokemons = await this.prisma.pokemon.findMany({
            where: { abilities: { some: { abilityId: ability.id } } },
            orderBy: { id: 'asc' },
            include: { abilities: { include: { ability: true } } },
        });

        return { ability: ability.name, items: pokemons, total: pokemons.length};
    }
}