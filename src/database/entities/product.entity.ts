import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, JoinTable, JoinColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { StoreEntity } from "./store.entity";
import { FileEntity } from "./file.entity";
import { OrderEntity } from "./order.entity";
import { CategoryEntity } from "./category.entity";
import { TagEntity } from "./tag.entity";
import { AttributeEntity } from "./attribute.entity";
import { GroupEntity } from "./group.entity";
import { AttributeValueEntity } from "./attribute_value.entity";
import { ProductVariationOptionEntity } from "./product-variation-option.entity";
import { ProductGalleryEntity } from "./product-gallery.entity";
import { ProductVariationEntity } from "./product-variation.entity";
import { ProductCategoryEntity } from "./product-category.entity";
import { ProductTagEntity } from "./product-tag.entity";

enum ProductType {
	SIMPLE = 'simple',
	VARIABLE = 'variable'
}

enum Status {
	PUBLISH = 'publish',
	DRAFT = 'draft'
}

@Entity('products')
export class ProductEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	storeId: number;

	@Column()
	name: string;

	@Column({ nullable: true })
	brand?: string;

	@Column({ unique: true })
	slug: string;

	@Column({ type: "longtext", nullable: true })
	description: string;

	@Column()
	groupId: number;

	@Column({ nullable: true })
	imageId: number;

	@Column({ nullable: true })
	video?: string;

	@Column({ nullable: true })
	unit?: number;    // 1 pc(s), 1 each

	@Column({ default: 1 })
	quantity: number;

	@Column({ nullable: true })
	price?: string;

	@Column({ nullable: true })
	salePrice?: string;

	@Column({ nullable: true })
	discount?: string;

	@Column({ nullable: true })
	minPice?: string;

	@Column({ nullable: true })
	maxPice?: string;

	@Column({ unique: true, nullable: true })
	sku?: string;

	@Column({ nullable: true })
	height?: string;

	@Column({ nullable: true })
	width?: string;

	@Column({ nullable: true })
	length?: string;

	@Column({ default: true })
	inStock: boolean;

	@Column({ default: false })
	isTaxable: boolean;

	@Column({ type: 'enum', enum: ProductType })
	productType: string;    // simple, variable

	@Column({ nullable: true })
	rating?: string;   

	@Column({ nullable: true })
	reviews?: string;   
	
	@Column({ type: 'enum', enum: Status, default: 'publish' })
	status: string;

	@Column({ default: false })
	isDeleted: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

	@ManyToOne(() => StoreEntity, store => store.products, { onDelete: 'CASCADE' })
	store: StoreEntity;

	@ManyToOne(() => GroupEntity, group => group.products, { onDelete: 'CASCADE' }) 
	group?: GroupEntity[]; 

	@OneToOne(() => FileEntity)
	@JoinColumn()
	image: FileEntity;

	@OneToMany(() => OrderEntity, order => order.product, { cascade: true })
	orders?: OrderEntity[];

	@ManyToMany(() => FileEntity)
	@JoinTable({
		name: "product_gallery", // table name for the junction table of this relation
		joinColumn: {
			name: "productId",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "imageId",
			referencedColumnName: "id"
		}
	})
	gallery: FileEntity[];

	@ManyToMany(() => CategoryEntity)
	@JoinTable({
		name: "product_categories", // table name for the junction table of this relation
		joinColumn: {
			name: "productId",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "categoryId",
			referencedColumnName: "id"
		}
	})
	categories: CategoryEntity[];

	@ManyToMany(() => TagEntity)
	@JoinTable({
		name: "product_tags", // table name for the junction table of this relation
		joinColumn: {
			name: "productId",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "tagId",
			referencedColumnName: "id"
		}
	})
	tags: TagEntity[];

	@ManyToMany(() => AttributeValueEntity)
	@JoinTable({
		name: "product_variations", // table name for the junction table of this relation
		joinColumn: {
			name: "productId",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "attributeValueId",
			referencedColumnName: "id"
		}
	})
	variations: AttributeValueEntity[];

	@OneToMany(() => ProductVariationOptionEntity, options => options.product, { cascade: true })
	variationOptions?: ProductVariationOptionEntity[];

}
