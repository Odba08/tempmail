import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { InboundEmailDto } from './dto/inbound-email.dto';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post('inbound-email')
  @HttpCode(HttpStatus.OK)
  async handleInboundEmail(@Body() body: InboundEmailDto | any) {
    const savedEmail = await this.emailsService.processInboundEmail(body);
    return {
      success: true,
      id: savedEmail.id,
      recipient: savedEmail.recipient,
      receivedAt: savedEmail.receivedAt,
    };
  }
}
