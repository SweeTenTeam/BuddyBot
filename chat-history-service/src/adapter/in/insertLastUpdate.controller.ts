import { Controller, Inject } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { InsertLastUpdateService } from "src/application/insertLastUpdate.service";
import { IU_USE_CASE } from "src/application/port/in/insertLastUpdate-usecase.port";
import { LastUpdateDTO } from "./dto/LastUpdateDTO";
import { LastUpdateCmd } from "src/domain/lastUpdateCmd";

@Controller()
export class InsertLastUpdateController {
    constructor(@Inject(IU_USE_CASE) private readonly insertLastUpdateService: InsertLastUpdateService) {}

    @MessagePattern('lastFetch_queue')
    async insertLastRetrieval(data: LastUpdateDTO): Promise<boolean>{
        console.log("2222222")
        console.log(data)
        console.log(data.LastFetch);
        const insertLU: LastUpdateCmd = {
            LastFetch: data.LastFetch
        }
        
        const newerUpdate = await this.insertLastUpdateService.insertLastRetrieval(insertLU);
        return newerUpdate;
    }
}