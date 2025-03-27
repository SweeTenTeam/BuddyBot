import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { MessageController } from './app.controller';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [ProducerService],
})
export class AppModule {}
