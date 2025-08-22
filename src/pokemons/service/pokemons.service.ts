import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PokemonsRepository } from '../repository/pokemons.repository';
import { CreatePokemonDto } from '../dto/create-pokemon.dto';
import { UpdatePokemonDto } from '../dto/update-pokemon.dto';
import { ListPokemonsQuery } from '../dto/list-pokemon.dto';
import { Prisma, PokemonType } from '@prisma/client';

@Injectable()
export class PokemonsService {
    constructor(private repo: PokemonsRepository) {}

    async create(dto: CreatePokemonDto) {
        const exists = await this.repo.findByNameInsensitive(dto.name);
        if (exists) throw new ConflictException('Pokemon name already exists');

        // upsert abilities by name (si las pasás por nombre)
        const abilityCreates = [];
        if (dto.abilities?.length) {
            for (const raw of Array.from(new Set(dto.abilities.map(a => a.trim()).filter(Boolean)))) {
                const found = await this.repo.findAbilityByNameInsensitive(raw);
                const abilityId = found ? found.id : (await this.repo.createAbility(raw)).id;
                abilityCreates.push({ ability: { connect: { id: abilityId } } });
            }
        }

        return this.repo.create({
            name: dto.name,
            type: dto.type as PokemonType,
            height: dto.height,
            weight: dto.weight,
            imageUrl: dto.imageUrl,
            ...(abilityCreates.length ? { abilities: { create: abilityCreates } } : {}),
        });
    }

    async findAll(q: ListPokemonsQuery) {
        const { page = 1, limit = 10, search, type, abilityIds, sortBy = 'id', order = 'asc' } = q;

        const and: Prisma.PokemonWhereInput[] = [];
        if (search) and.push({ name: { contains: search, mode: 'insensitive' } });
        if (type)   and.push({ type });
        if (abilityIds?.length) {
            and.push({ abilities: { some: { abilityId: { in: abilityIds } } } });
        }

        const where = and.length ? { AND: and } : {};
        const [total, items] = await Promise.all([
            this.repo.count(where),
            this.repo.findMany({
                where,
                orderBy: { [sortBy]: order },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: number) {
        const pokemon = await this.repo.findById(id);
        if (!pokemon) throw new NotFoundException('Pokemon not found');
        return pokemon;
    }

    async update(id: number, dto: UpdatePokemonDto) {
        const exists = await this.repo.findById(id);
        if (!exists) throw new NotFoundException('Pokemon not found');

        if (dto.name) {
            const dup = await this.repo.findByNameInsensitiveExcludingId(dto.name, id);
            if (dup) throw new ConflictException('Pokemon name already exists');
        }

        let abilitiesData: Prisma.PokemonAbilityUpdateManyWithoutPokemonNestedInput | undefined;
        if (dto.abilities) {
            const abilityCreates = [];
            for (const raw of Array.from(new Set(dto.abilities.map(a => a.trim()).filter(Boolean)))) {
                const found = await this.repo.findAbilityByNameInsensitive(raw);
                const abilityId = found ? found.id : (await this.repo.createAbility(raw)).id;
                abilityCreates.push({ ability: { connect: { id: abilityId } } });
            }
            abilitiesData = { deleteMany: {}, create: abilityCreates };
        }

        return this.repo.update(id, {
            name: dto.name,
            type: dto.type as PokemonType,
            height: dto.height,
            weight: dto.weight,
            imageUrl: dto.imageUrl,
            ...(abilitiesData ? { abilities: abilitiesData } : {}),
        });
    }

    async remove(id: number) {
        const exists = await this.repo.findById(id);
        if (!exists) throw new NotFoundException('Pokemon not found');
        await this.repo.delete(id);
        return { deleted: true };
    }
}