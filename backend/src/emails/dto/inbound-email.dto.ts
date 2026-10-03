import { IsOptional, IsString } from 'class-validator';

export class InboundEmailDto {
  @IsOptional()
  @IsString()
  recipient?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  // Compatibilidad con formatos Mailgun/Sendgrid/Cloudflare
  @IsOptional()
  @IsString()
  'body-plain'?: string;

  @IsOptional()
  @IsString()
  'body-html'?: string;

  @IsOptional()
  @IsString()
  'stripped-text'?: string;

  @IsOptional()
  @IsString()
  'stripped-html'?: string;
}
