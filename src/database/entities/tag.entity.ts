import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, JoinTable, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { GroupEntity } from "./group.entity";
import { FileEntity } from "./file.entity";
import { ProductEntity } from "./product.entity";

@Entity('tags')
export class TagEntity  {
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

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;
	
	@ManyToOne(type => GroupEntity) 
	@JoinColumn() 
	group: GroupEntity; 

	@OneToOne(() => FileEntity) 
	@JoinColumn() 
	image: FileEntity;
}
