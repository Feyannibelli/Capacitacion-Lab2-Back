import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AbilitiesService {
    constructor(private prisma: PrismaService) {}

    async getAbilitiesByIds(ids?: number[]) {
        const where = ids?.length ? { id: { in: ids } } : {};
        return this.prisma.ability.findMany({ where, orderBy: { id: 'asc' } });
    }

    async getAbilityById(id: number) {
        const ability = await this.prisma.ability.findUnique({ where: { id } });
        if (!ability) throw new NotFoundException('Ability not found');
        return ability;
    }
}
