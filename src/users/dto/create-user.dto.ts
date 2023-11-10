import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/database/entities/role.entity';

export class CreateUserDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  profile_picture: string;

  @ApiProperty()
  role: number | Role;
}
