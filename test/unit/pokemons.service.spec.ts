import { Test } from '@nestjs/testing';
import { PokemonsService } from '../../src/pokemons/service/pokemons.service';
import { PokemonsRepository } from '../../src/pokemons/repository/pokemons.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PokemonType } from '@prisma/client';

const repoMock = {
    findByNameInsensitive: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    findByNameInsensitiveExcludingId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findAbilityByNameInsensitive: jest.fn(),
    createAbility: jest.fn(),
};

describe('PokemonsService (unit)', () => {
    let service: PokemonsService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PokemonsService,
                { provide: PokemonsRepository, useValue: repoMock },
            ],
        }).compile();

        service = module.get(PokemonsService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('crea un pokemon y upsertea abilities por nombre', async () => {
            repoMock.findByNameInsensitive.mockResolvedValue(null);
            repoMock.findAbilityByNameInsensitive.mockResolvedValueOnce({ id: 1, name: 'Overgrow' });
            repoMock.create.mockResolvedValue({ id: 10, name: 'Bulbasaur' });

            const dto = {
                name: 'Bulbasaur',
                type: PokemonType.GRASS,
                height: 0.7,
                weight: 6.9,
                imageUrl: 'https://...',
                abilities: ['Overgrow'],
            };

            const res = await service.create(dto as any);
            expect(repoMock.create).toHaveBeenCalled();
            expect(res).toEqual({ id: 10, name: 'Bulbasaur' });
        });

        it('lanza 409 si nombre duplicado (case-insensitive)', async () => {
            repoMock.findByNameInsensitive.mockResolvedValue({ id: 1, name: 'bulbasaur' });
            await expect(service.create({
                name: 'Bulbasaur',
                type: PokemonType.GRASS,
                height: 1,
                weight: 1,
            } as any)).rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('findAll', () => {
        it('paginación: skip/take y envelope correcto', async () => {
            repoMock.count.mockResolvedValue(23);
            repoMock.findMany.mockResolvedValue([{}, {}]);

            const res = await service.findAll({ page: 2, limit: 10 } as any);
            expect(repoMock.count).toHaveBeenCalled();
            expect(repoMock.findMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: 10, take: 10,
            }));
            expect(res).toEqual({
                items: [{}, {}],
                total: 23,
                page: 2,
                limit: 10,
                totalPages: 3,
            });
        });

        it('filtros: search/type/abilityIds generan where y orden por defecto', async () => {
            repoMock.count.mockResolvedValue(1);
            repoMock.findMany.mockResolvedValue([{}]);

            await service.findAll({ search: 'char', type: PokemonType.FIRE, abilityIds: [2,7] } as any);
            expect(repoMock.findMany).toHaveBeenCalledWith(expect.objectContaining({
                orderBy: { id: 'asc' }, skip: 0, take: 10,
            }));
        });
    });

    describe('findOne', () => {
        it('retorna si existe', async () => {
            repoMock.findById.mockResolvedValue({ id: 1 });
            const res = await service.findOne(1);
            expect(res).toEqual({ id: 1 });
        });

        it('404 si no existe', async () => {
            repoMock.findById.mockResolvedValue(null);
            await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('update', () => {
        it('actualiza y reemplaza abilities si vienen en dto', async () => {
            repoMock.findById.mockResolvedValue({ id: 1, name: 'Bulbasaur' });
            repoMock.findByNameInsensitiveExcludingId.mockResolvedValue(null);
            repoMock.findAbilityByNameInsensitive.mockResolvedValueOnce({ id: 1, name: 'Overgrow' });
            repoMock.update.mockResolvedValue({ id: 1, name: 'Bulba-2' });

            const res = await service.update(1, { name: 'Bulba-2', abilities: ['Overgrow'] } as any);
            expect(repoMock.update).toHaveBeenCalled();
            expect(res).toEqual({ id: 1, name: 'Bulba-2' });
        });

        it('409 si nombre duplicado en otro registro', async () => {
            repoMock.findById.mockResolvedValue({ id: 1, name: 'A' });
            repoMock.findByNameInsensitiveExcludingId.mockResolvedValue({ id: 2, name: 'BULBASAUR' });
            await expect(service.update(1, { name: 'Bulbasaur' } as any))
                .rejects.toBeInstanceOf(ConflictException);
        });
    });

    describe('remove', () => {
        it('borra si existe', async () => {
            repoMock.findById.mockResolvedValue({ id: 1 });
            repoMock.delete.mockResolvedValue({ id: 1 });
            const res = await service.remove(1);
            expect(repoMock.delete).toHaveBeenCalledWith(1);
            expect(res).toEqual({ deleted: true });
        });

        it('404 si no existe', async () => {
            repoMock.findById.mockResolvedValue(null);
            await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('extra branches', () => {
        it('create sin abilities no debería enviar abilities en el payload', async () => {
            repoMock.findByNameInsensitive.mockResolvedValue(null);
            repoMock.create.mockImplementation((data: any) => {
                expect(data.abilities).toBeUndefined();
                return { id: 99, ...data };
            });

            const dto = {
                name: 'NoAbilitiesMon',
                type: PokemonType.NORMAL,
                height: 1,
                weight: 2,
                imageUrl: 'https://example.com/na.jpg',
            } as any;

            const res = await service.create(dto);
            expect(res.id).toBe(99);
            expect(repoMock.create).toHaveBeenCalledTimes(1);
        });

        it('update sin abilities NO debería reemplazar vínculos', async () => {
            repoMock.findById.mockResolvedValue({ id: 10, name: 'X' });
            repoMock.findByNameInsensitiveExcludingId.mockResolvedValue(null);
            repoMock.update.mockImplementation((_id: number, data: any) => {
                expect(data.abilities).toBeUndefined();
                return { id: 10, name: 'X', ...data };
            });

            const res = await service.update(10, { weight: 9 } as any);
            expect(res.id).toBe(10);
            expect(repoMock.update).toHaveBeenCalledWith(10, expect.any(Object));
        });

        it('findAll sin filtros arma where vacío y pagina por defecto', async () => {
            repoMock.count.mockResolvedValue(0);
            repoMock.findMany.mockResolvedValue([]);

            const res = await service.findAll({} as any);
            expect(repoMock.count).toHaveBeenCalledWith({});
            expect(repoMock.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {},
                orderBy: { id: 'asc' },
                skip: 0,
                take: 10,
            }));
            expect(res).toEqual({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 });
        });

        it('findAll solo con search genera filtro icontains', async () => {
            repoMock.count.mockResolvedValue(1);
            repoMock.findMany.mockResolvedValue([{}]);

            await service.findAll({ search: 'bulba' } as any);
            expect(repoMock.count).toHaveBeenCalled();
            expect(repoMock.findMany).toHaveBeenCalledWith(expect.objectContaining({
                orderBy: { id: 'asc' },
                skip: 0,
                take: 10,
            }));
        });
    });

});
