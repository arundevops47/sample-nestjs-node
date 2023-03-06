import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, Column, Index, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { GroupEntity } from "./group.entity";
import { FileEntity } from "./file.entity";

@Entity('categories')
export class CategoryEntity  {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
	groupId: number; 

	@Column()
	name: string;  

	@Column({ unique: true })
  slug: string;

	@Column({ nullable: true })
  icon?: string;

	@Column({ nullable: true })
	imageId: number; 

	@Column({ type: "longtext", nullable: true })
  details?: string;

	@Column({ default: true })
  status: boolean;

	@DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

	@Column({ nullable: true })
	parentId?: number; 

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

	@OneToOne(() => FileEntity) 
	@JoinColumn() 
	image: FileEntity;
	
	@ManyToOne(type => GroupEntity, group => group.categories)
  group: GroupEntity;

	@ManyToOne(type => CategoryEntity, category => category.children)
  parent: CategoryEntity;

  @OneToMany(type => CategoryEntity, category => category.parent)
  children: CategoryEntity[];

}
