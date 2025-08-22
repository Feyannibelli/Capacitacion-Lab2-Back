import { Module } from '@nestjs/common';
import { AbilitiesController } from './controller/abilities.controller';
import { AbilitiesService } from './service/abilities.service';
import { AbilitiesRepository } from './repository/abilities.repository';

@Module({
    controllers: [AbilitiesController],
    providers: [AbilitiesService, AbilitiesRepository],
    exports: [AbilitiesService],
})
export class AbilitiesModule {}