import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, PokemonType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PokemonsRepository {
    constructor(private prisma: PrismaService) {}

    create(data: Prisma.PokemonCreateInput) {
        return this.prisma.pokemon.create({
            data,
            include: { abilities: { include: { ability: true } } },
        });
    }

    count(where: Prisma.PokemonWhereInput) {
        return this.prisma.pokemon.count({ where });
    }

    findMany(params: {
        where: Prisma.PokemonWhereInput,
        orderBy: Prisma.PokemonOrderByWithRelationInput,
        skip: number, take: number
    }) {
        const { where, orderBy, skip, take } = params;
        return this.prisma.pokemon.findMany({
            where, orderBy, skip, take,
            include: { abilities: { include: { ability: true } } },
        });
    }

    findById(id: number) {
        return this.prisma.pokemon.findUnique({
            where: { id },
            include: { abilities: { include: { ability: true } } },
        });
    }

    findByNameInsensitive(name: string) {
        return this.prisma.pokemon.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
    }

    findByNameInsensitiveExcludingId(name: string, id: number) {
        return this.prisma.pokemon.findFirst({
            where: { id: { not: id }, name: { equals: name, mode: 'insensitive' } },
        });
    }

    update(id: number, data: Prisma.PokemonUpdateInput) {
        return this.prisma.pokemon.update({
            where: { id },
            data,
            include: { abilities: { include: { ability: true } } },
        });
    }

    delete(id: number) {
        return this.prisma.pokemon.delete({ where: { id } });
    }

    findAbilityByNameInsensitive(name: string) {
        return this.prisma.ability.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } },
        });
    }

    createAbility(name: string) {
        return this.prisma.ability.create({ data: { name } });
    }
}