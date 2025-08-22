import { Injectable, NotFoundException } from '@nestjs/common';
import { AbilitiesRepository } from '../repository/abilities.repository';

@Injectable()
export class AbilitiesService {
    constructor(private repo: AbilitiesRepository) {}

    getAbilitiesByIds(ids?: number[]) {
        return this.repo.findManyByIds(ids);
    }

    async getAbilityById(id: number) {
        const ability = await this.repo.findById(id);
        if (!ability) throw new NotFoundException('Ability not found');
        return ability;
    }
}