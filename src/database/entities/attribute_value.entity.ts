import { Entity, Column, Index, PrimaryGeneratedColumn, JoinColumn, JoinTable, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { ProductEntity } from "./product.entity";
import { AttributeEntity } from "./attribute.entity";
import { ProductVariationEntity } from "./product-variation.entity";

@Entity('attribute_values')
export class AttributeValueEntity  {
	
  @PrimaryGeneratedColumn() 
	id: number;

	@Column() 
	storeId: number;  

	@Column() 
	attributeId: number; 

	@Column() 
	meta: string; 

	@Column() 
	value: string;  

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;
 
	@ManyToOne(() => AttributeEntity, attribute => attribute.values, { onDelete: 'CASCADE'}) 
	@JoinColumn({ name: "attributeId" }) 
	attribute: AttributeEntity; 

}
