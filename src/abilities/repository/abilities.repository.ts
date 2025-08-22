import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AbilitiesRepository {
    constructor(private prisma: PrismaService) {}

    findManyByIds(ids?: number[]) {
        const where = ids?.length ? { id: { in: ids } } : {};
        return this.prisma.ability.findMany({ where, orderBy: { id: 'asc' } });
    }

    findById(id: number) {
        return this.prisma.ability.findUnique({ where: { id } });
    }

    create(name: string) {
        return this.prisma.ability.create({ data: { name } });
    }
}