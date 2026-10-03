import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  recipient: string; // Correo temporal al que fue enviado

  @Column({ type: 'varchar', length: 255 })
  sender: string; // Remitente

  @Column({ type: 'varchar', length: 500, default: '(Sin Asunto)' })
  subject: string;

  @Column({ type: 'text', nullable: true })
  textBody: string;

  @Column({ type: 'text', nullable: true })
  htmlBody: string;

  @Index()
  @CreateDateColumn()
  receivedAt: Date;
}
