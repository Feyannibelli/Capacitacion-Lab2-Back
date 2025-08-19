import { Module } from '@nestjs/common';
import { AbilitiesService} from "../service/abilities.service";
import { AbilitiesController} from "../controller/abilities.controller";

@Module({
    controllers: [AbilitiesController],
    providers: [AbilitiesService],
})
export class AbilitiesModule {}