// InsertChatController.ts
import { Controller, Post, Body, Inject } from '@nestjs/common';
import { IC_USE_CASE, InsertChatUseCase } from '../../application/port/in/insertChat-usecase.port';
import { InsertRequestDTO } from '../in/dto/InsertRequestDTO';

@Controller('chat')
export class InsertChatController {
    constructor(@Inject(IC_USE_CASE) private readonly insertChatUseCase: InsertChatUseCase) { }

    @Post('insert')
    async insertChat(@Body() req: InsertRequestDTO): Promise<boolean> {
        return this.insertChatUseCase.insertChat(req);
    }
}
