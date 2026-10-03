import { Controller, Get, Delete, Param } from '@nestjs/common';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get(':direccion')
  async getInbox(@Param('direccion') direccion: string) {
    return this.emailsService.getInboxForAddress(direccion);
  }

  @Get('detail/:id')
  async getEmailDetail(@Param('id') id: string) {
    return this.emailsService.getEmailById(id);
  }

  @Delete(':id')
  async deleteEmail(@Param('id') id: string) {
    return this.emailsService.deleteEmail(id);
  }
}
