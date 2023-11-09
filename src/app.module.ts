import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { GamesModule } from './games/games.module';
import { ServiceTypesModule } from './service_types/service_types.module';
import { PricesModule } from './prices/prices.module';

@Module({
  imports: [UsersModule, TransactionsModule, GamesModule, ServiceTypesModule, PricesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
