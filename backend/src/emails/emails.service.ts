import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './entities/email.entity';
import { InboundEmailDto } from './dto/inbound-email.dto';
import { simpleParser } from 'mailparser';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
  ) {}

  /**
   * Procesa y almacena un correo entrante recibido desde el Webhook Catch-All
   */
  async processInboundEmail(payload: InboundEmailDto | any): Promise<Email> {
    let cleanRecipient = '';
    let cleanSender = '';
    let subject = '(Sin Asunto)';
    let textBody = '';
    let htmlBody = '';

    // Si viene contenido crudo (MIME raw)
    const rawContent = payload.raw || payload.email || (typeof payload === 'string' ? payload : null);

    if (rawContent) {
      try {
        const parsed = await simpleParser(rawContent);
        subject = parsed.subject || '(Sin Asunto)';
        textBody = parsed.text || '';
        htmlBody = (parsed.html as string) || '';
        cleanSender = parsed.from?.value?.[0]?.address || this.extractCleanEmail(payload.from || '');
        cleanRecipient =
          parsed.to && Array.isArray(parsed.to)
            ? parsed.to[0]?.value?.[0]?.address || ''
            : (parsed.to as any)?.value?.[0]?.address || this.extractCleanEmail(payload.to || payload.recipient || '');
      } catch (err) {
        this.logger.warn('Fallo parseo con simpleParser, usando fallback:', err);
      }
    }

    // Si no se extrajo o viene como campos JSON directos
    if (!cleanRecipient) {
      const rawRecipient = payload.recipient || payload.to || '';
      cleanRecipient = this.extractCleanEmail(rawRecipient).toLowerCase().trim();
    }
    if (!cleanSender) {
      const rawSender = payload.sender || payload.from || 'desconocido@remitente.com';
      cleanSender = this.extractCleanEmail(rawSender);
    }
    if (subject === '(Sin Asunto)') {
      subject = payload.subject || payload['Subject'] || '(Sin Asunto)';
    }
    if (!textBody) {
      textBody =
        payload.text ||
        payload['body-plain'] ||
        payload['stripped-text'] ||
        '';
    }
    if (!htmlBody) {
      htmlBody =
        payload.html ||
        payload['body-html'] ||
        payload['stripped-html'] ||
        '';
    }

    const email = this.emailRepository.create({
      recipient: cleanRecipient,
      sender: cleanSender,
      subject,
      textBody,
      htmlBody,
    });

    const savedEmail = await this.emailRepository.save(email);
    this.logger.log(`📥 [Webhook] Correo guardado para: ${cleanRecipient} | Asunto: "${subject}"`);
    return savedEmail;
  }

  /**
   * Obtiene todos los correos recibidos para una dirección temporal
   */
  async getInboxForAddress(address: string): Promise<Email[]> {
    const cleanAddress = this.extractCleanEmail(address).toLowerCase().trim();

    return this.emailRepository.find({
      where: { recipient: cleanAddress },
      order: { receivedAt: 'DESC' },
      take: 100,
    });
  }

  /**
   * Obtiene el detalle de un correo específico por ID
   */
  async getEmailById(id: string): Promise<Email> {
    const email = await this.emailRepository.findOne({ where: { id } });
    if (!email) {
      throw new NotFoundException(`Correo con ID ${id} no encontrado`);
    }
    return email;
  }

  /**
   * Elimina un correo de la bandeja
   */
  async deleteEmail(id: string): Promise<{ deleted: boolean }> {
    const email = await this.getEmailById(id);
    await this.emailRepository.remove(email);
    return { deleted: true };
  }

  /**
   * Extrae únicamente la dirección de correo limpia (ej: "Juan <test@tudominio.com>" -> "test@tudominio.com")
   */
  private extractCleanEmail(raw: string): string {
    if (!raw) return '';
    const match = raw.match(/<([^>]+)>/);
    return match ? match[1] : raw.trim();
  }
}
