import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TestController {

  @MessagePattern('ez_pattern')
  async handleMessage(data: Record<string, any>) {
    console.log('Received message:', data);
    // Add your message processing logic here
    return 'hello?';
  }

  @MessagePattern('wtf_pattern')
  async chill(data: Record<string, any>) {
    console.log('Received message:', data);
    // Add your message processing logic here
    return 'wtf?';
  }
}