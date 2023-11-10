import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { ServiceType } from './entities/service_type.entity';
import { Transaction } from './entities/transaction.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      User,
      ServiceType,
      Transaction,
      /*ADD_OTHER_ENTITY_HERE*/
    ]),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
