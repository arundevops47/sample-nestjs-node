import { Timestamp } from 'rxjs';
import { CoreEntity } from 'src/common/entities/core.entity';
import { EntitySchema, Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";
import { FileEntity } from "./file.entity";
import { OrderEntity } from "./order.entity";
import { AttributeEntity } from "./attribute.entity";
import { StoreCategoryEntity } from "./store-category.entity";
import { StoreDocumentEntity } from "./store-document.entity";
import { StoreAddressEntity } from "./store-address.entity";
import { StoreSocialEntity } from "./store_socials.entity";
import { StoreSettingsEntity } from "./store-settings.entity";

@Entity('stores')
export class StoreEntity  {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
	ownerId: number;  

	@Column()
	storeCategoryId: number;  

	@Column({ unique: true })
	slug: string;  

	@Column()
	name: string;  

	@Column({ type: "longtext", nullable: true})
  description: string;

	@Column({ nullable: true })
  logoId: number;
	
	@Column({ nullable: true })
  coverImageId: number;

	@Column({ default: 0 })
	totalCoins: number;  

	@Column({ nullable: true })
	tags: string;  

	@Column({ default: false })
  isApproved: boolean;

	@Column({ default: false })
  isActive: boolean;

	@Column()
	addressId: number;  

	@Column()
	settingsId: number;  

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

	@ManyToOne(() => StoreCategoryEntity, storeCategory => storeCategory.stores, { onDelete: 'CASCADE'}) 
	@JoinColumn({ name: 'storeCategoryId'}) 
	storeCategory: StoreCategoryEntity; 

	@ManyToOne(() => UserEntity, user => user.stores, { onDelete: 'CASCADE'}) 
	@JoinColumn({ name: 'ownerId'}) 
	owner: UserEntity; 

	@OneToOne(() => FileEntity) 
	@JoinColumn() 
	logo: FileEntity;

	@OneToOne(() => FileEntity) 
	@JoinColumn() 
	coverImage: FileEntity;

	@OneToOne(() => StoreAddressEntity, address => address.store) 
	@JoinColumn() 
	address: StoreAddressEntity;

	@OneToOne(() => StoreSettingsEntity, settings => settings.store) 
	@JoinColumn() 
	settings: StoreSettingsEntity;

	// @OneToMany(() => StoreDocumentTypeEntity, docType => docType.type, { cascade: true }) 
	// documentTypes: StoreDocumentTypeEntity[];

	@OneToMany(() => AttributeEntity, attribute => attribute.store, { cascade: true }) 
	attributes: AttributeEntity[];

	@OneToMany(() => StoreDocumentEntity, docs => docs.store, { cascade: true }) 
	documents: StoreDocumentEntity[];

	@OneToMany(() => StoreSocialEntity, social => social.store, { cascade: true }) 
	socials: StoreSocialEntity[];
	
	@OneToMany(() => ProductEntity, product => product.store, { cascade: true }) 
	products: ProductEntity[];

	@OneToMany(() => OrderEntity, order => order.store, { cascade: true }) 
	orders: OrderEntity[];

}
