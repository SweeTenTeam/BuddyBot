import { Controller, Inject } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { LastUpdateDTO } from "./dto/LastUpdateDTO";
import { FU_USE_CASE } from "src/application/port/in/fetchLastUpdate-usecase";
import { FetchLastUpdateService } from "src/application/fetchLastUpdate.service";

@Controller()
export class FetchLastUpdateController{
    constructor(@Inject(FU_USE_CASE) private readonly fetchLastUpdateService: FetchLastUpdateService) {}

    @MessagePattern('getLastUpdate_queue')
    async fetchLastUpdate(): Promise<LastUpdateDTO>{
        const lastUpdate = await this.fetchLastUpdateService.fetchLastUpdate();
        return new LastUpdateDTO(lastUpdate.lastFetch)
    }
}