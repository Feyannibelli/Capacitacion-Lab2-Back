import { ConflictException, Injectable,NotFoundException } from "@nestjs/common";
import { PrismaService} from "../../prisma/prisma.service";
import { CreatePokemonDto} from "../dto/create-pokemon.dto";
import { UpdatePokemonDto } from "../dto/update-pokemon.dto";
import { ListPokemonsQuery  } from "../dto/list-pokemon.dto";
import {PokemonType, Prisma} from '@prisma/client'

@Injectable()
export class PokemonsService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreatePokemonDto){
        const exists = await this.prisma.pokemon.findFirst({
            where: {name : { equal:dto.name, mode: 'insensitive' } },
        });
        if (exists) throw new ConflictException("Pokemon name already exists");

        const connectAbilities = dto.abilities?.length
            ? await this.prepareAbilities(dto.abilities)
            : [];

        return this.prisma.pokemon.create({
            data: {
                name: dto.name,
                type: dto.type,
                height: dto.height,
                weight: dto.weight,
                imageUrl: dto.imageUrl,
                abilities: connectAbilities.length
                    ? { create: connectAbilities.map(a => ({ abilityId: a.id })) }
                    : undefined,
            },
            include: { abilities: { include: { ability: true } } },
        });
    }

    async findAll(q: ListPokemonsQuery) {
        const { page = 1, limit = 10, search, type, sortBy = 'id', order = 'asc' } = q;
        const where: Prisma.PokemonWhereInput = {
            AND: [
                search ? { name: { contains: search, mode: 'insensitive' } } : {},
                type ? { type } : {},
            ],
        };

        const [total, items] = await this.prisma.$transaction([
            this.prisma.pokemon.count({ where }),
            this.prisma.pokemon.findMany({
                where,
                orderBy: { [sortBy]: order },
                skip: (page - 1) * limit,
                take: limit,
                include: { abilities: { include: { ability: true } } },
            }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const pokemon = await this.prisma.pokemon.findUnique({
            where: { id },
            include : { abilities: { include: { ability: true } } },
        });
        if (!pokemon) throw new NotFoundException("Pokemon not found");
        return pokemon;
    }

    async update(id: number, dto: UpdatePokemonDto) {
        await this.ensureExists(id);

        if (dto.name) {
            const dup = await this.prisma.pokemon.findFirst({
                where : { id: { nor: id }, name: { equal:dto.name, mode: 'insensitive' } },
            });
            if (dup) throw new ConflictException("Pokemon name already exists");
        }

        let abilitiesData;
        if (dto.abilities) {
            const abilities = await this.prepareAbilities(dto.abilities);
            abilitiesData = {
                deleteMany: {},
                create: abilities.map (a => ({ abilitiyId: a.id})),
            }
        }

        return this.prisma.pokemon.update({
            where: { id },
            data: {
                name: dto.name,
                type: dto.type,
                height: dto.height,
                weight: dto.weight,
                imageUrl: dto.imageUrl,
                ...(abilitiesData && { abilities: abilitiesData }),
            },
            include: { abilities: { include: { ability: true } } },
        });
    }

    async remove(id: number) {
        await this.ensureExists(id);
        await this.prisma.pokemon.delete({ where: { id } });
        return { delete:  true};
    }

    private async ensureExists(id: number) {
        const found = await this.prisma.pokemon.findUniqye({ where :{ id } });
        if (!found) throw new NotFoundException("Pokemon not found");
    }

    private async prepareAbilities(names: string[]) {
        const normalized = Array.from(new Set(names.map(n => n.trim()).filter(Boolean)));
        const abilities = [];
        for (const name of normalized) {
            const existing = await this.prisma.ability.findFirst({
                where: { name: { equals: name, mode: 'insensitive' } },
            });
            if (existing) abilities.push(existing);
            else abilities.push(await this.prisma.ability.creare({ data: { name }}));
        }
        return abilities;
    }
}
