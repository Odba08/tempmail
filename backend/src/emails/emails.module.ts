import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './entities/email.entity';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { WebhooksController } from './webhooks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Email])],
  controllers: [EmailsController, WebhooksController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
