import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { StoreEntity } from "./store.entity";
import { AttributeValueEntity } from "./attribute_value.entity";

@Entity('attributes')
export class AttributeEntity  {
  @PrimaryGeneratedColumn() 
	id: number;

	@Column() 
	storeId: number;  

	@Column() 
	name: string;  

	@Column({ unique: true }) 
	slug: string;  

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;
 
	@ManyToOne(() => StoreEntity, store => store.attributes) 
	@JoinColumn({ name: 'storeId' }) 
	store: StoreEntity; 

	@OneToMany(() => AttributeValueEntity, value => value.attribute, { cascade: true }) 
	values: AttributeValueEntity[]; 	
}
