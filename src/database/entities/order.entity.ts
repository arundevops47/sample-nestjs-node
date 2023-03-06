import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from "./user.entity";
import { StoreEntity } from "./store.entity";
import { ProductEntity } from "./product.entity";

@Entity('orders')
export class OrderEntity  {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
	userId: number;  

	@Column()
	storeId: number;  

	@Column()
	productId: number;  

	@Column({unique: true})
  email: string;

	@Column({nullable: true})
  image: string;
	
	@Column({ type: "longtext", nullable: true})
  address: string;

	@Column({ type: "longtext", nullable: true})
  address2: string;

	@Column({nullable: true})
  country: string;

	@Column({nullable: true})
  city: string;

	@Column({nullable: true})
  state: string;

	@Column({nullable: true})
  zip: string;

	@Column({ default: true })
  status: boolean;

	@Column({nullable: true})
  trackingNumber: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

	@ManyToOne(type => UserEntity, user => user.orders) 
	user: UserEntity; 

	@ManyToOne(type => StoreEntity, store => store.orders) 
	store: StoreEntity; 

	@ManyToOne(type => ProductEntity, product => product.orders, { onDelete: 'CASCADE'}) 
	product: ProductEntity; 
}
