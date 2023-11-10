// user.entity.ts
import { Role } from 'src/database/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column({ default: 0 })
  balance: number;
  @Column({ nullable: true })
  profile_picture: string;
  @Column()
  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn([{ name: 'role', referencedColumnName: 'id' }])
  role: Role | number;
  @CreateDateColumn({ nullable: true })
  createdAt: Date;
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
