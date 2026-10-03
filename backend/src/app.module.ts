import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;
        const baseConfig: any = {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true, // Auto crea las tablas en la BD
        };

        if (process.env.DATABASE_URL) {
          baseConfig.url = process.env.DATABASE_URL;
          baseConfig.ssl = { rejectUnauthorized: false };
        } else {
          baseConfig.host = process.env.DB_HOST || 'localhost';
          baseConfig.port = +(process.env.DB_PORT || 5432);
          baseConfig.username = process.env.DB_USERNAME || 'postgres';
          baseConfig.password = process.env.DB_PASSWORD || 'postgres';
          baseConfig.database = process.env.DB_NAME || 'tempmail_db';
          if (process.env.DB_SSL === 'true') {
            baseConfig.ssl = { rejectUnauthorized: false };
          }
        }

        return baseConfig;
      },
    }),
    EmailsModule,
  ],
})
export class AppModule {}
