import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { StoreEntity } from "./store.entity";

@Entity('store_settings')
export class StoreSettingsEntity  {
  @PrimaryGeneratedColumn() 
	id: number;

	@OneToOne(() => StoreEntity) 
	@JoinColumn() 
	store: StoreEntity; 

	@Column({ nullable: true }) 
	contact: string;

	@Column({nullable: true})
  website: string;

	@Column({nullable: true})
  supportEmail: string;

	@Column({nullable: true})
  supportPhone: string;

	@Column({nullable: true})
  lang: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

}
