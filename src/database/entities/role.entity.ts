import { Entity, Column, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from "./user.entity";

enum RoleType {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner',
	USER = 'user',
  CUSTOMER = 'customer',
	STAFF = 'staff'
}

@Entity('roles')
export class RoleEntity  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: RoleType })
  slug: string;

  @Column({nullable: true})
  name: string;

	@Column({ default: true })
  enable: boolean;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

	@OneToMany(type => UserEntity, user => user.role) 
	users: UserEntity[];
}
