import { Test } from '@nestjs/testing';
import { AbilitiesService } from '../../src/abilities/service/abilities.service';
import { AbilitiesRepository } from '../../src/abilities/repository/abilities.repository';
import { NotFoundException } from '@nestjs/common';

const repoMock = { findManyByIds: jest.fn(), findById: jest.fn() };

describe('AbilitiesService (unit)', () => {
    let service: AbilitiesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AbilitiesService,
                { provide: AbilitiesRepository, useValue: repoMock },
            ],
        }).compile();
        service = module.get(AbilitiesService);
        jest.clearAllMocks();
    });

    it('lista por ids (o todas si no hay ids)', async () => {
        repoMock.findManyByIds.mockResolvedValue([{ id: 1 }, { id: 2 }]);
        const res = await service.getAbilitiesByIds([1,2]);
        expect(res).toHaveLength(2);
    });

    it('get one by id', async () => {
        repoMock.findById.mockResolvedValue({ id: 1, name: 'Overgrow' });
        const res = await service.getAbilityById(1);
        expect(res).toEqual({ id: 1, name: 'Overgrow' });
    });

    it('404 si no existe', async () => {
        repoMock.findById.mockResolvedValue(null);
        await expect(service.getAbilityById(999)).rejects.toBeInstanceOf(NotFoundException);
    });
});
