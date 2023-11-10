import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('env', () => ({
  port: parseInt(process.env.PORT, 10) || 8307,

  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOTS || '',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASS || '',
    database: process.env.DATABASE_NAME || '',
    autoLoadEntities: true,
    synchronize: true,
  },

  mail: {
    transport: {
      service: process.env.MAIL_SERVICE || '',
      host: process.env.MAIL_HOST || '',
      port: parseInt(process.env.MAIL_PORT, 10) || 3306,
      auth: {
        user: process.env.MAIL_USERNAME || '',
        pass: process.env.MAIL_PASSWORD || '',
      },
      tls: { rejectUnauthorized: false },
      debug: parseInt(process.env.MAIL_PORT, 10) === 1,
    },
    defaults: {
      from: process.env.MAIL_FROM || '',
    },
    resetPassUrl: process.env.MAIL_RESET_PASSWORD_URL || '',
  },

  jwt_secret_key: 'Sch00l9@2O23',
}));
