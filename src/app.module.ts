import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GamesModule } from './games/games.module';
import { ServiceTypesModule } from './service_types/service_types.module';
import { PricesModule } from './prices/prices.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'notSecureChangeMe',
      database: 'test',
      synchronize: true,
      entities: ['dist/database/entities/*.js'],
    }),
    DatabaseModule,
    UsersModule,
    TransactionsModule,
    GamesModule,
    ServiceTypesModule,
    PricesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
