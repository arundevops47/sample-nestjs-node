import * as bcrypt from 'bcrypt';
import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinTable,JoinColumn, BeforeInsert, BeforeUpdate, OneToOne, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { StoreEntity } from "./store.entity";
import { OrderEntity } from "./order.entity";
import { RoleEntity } from "./role.entity";
import { PostEntity } from "./posts.entity";
import { PostCommentEntity } from "./post_comments.entity";
import { FileEntity } from "./file.entity";


@Entity('users')
export class UserEntity  {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
	roleId: number;                 

  @Column()
  firstName: string;

  @Column()
  lastName: string;

	@Column()
  fullName: string;

	@Column({unique: true})
  email: string;

	@Column({ default: false })
  emailVerified: boolean;

	@Column({ nullable: true })
  phone: string;

	@Column({ default: false })
  phoneVerified: boolean;

	@Column({ select: false })
  password: string;

	@Column({ nullable: true })
  profilePicId: number;

	@Column({ nullable: true })
  coverPhotoId: number;

	@Column({ nullable: true })
  timezone: string;

	@Column({ nullable: true })
  loginDevice: string;

	@Column({ nullable: true })
  lastLogin: Date;

	@Column({ nullable: true })
  socialProviderName: string;

	@Column({ default: true })
  status: boolean;

	@Column({ nullable: true })
  passwordToken: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  @BeforeInsert()
	@BeforeUpdate()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(password || this.password, salt)
  }
	
	@OneToOne(() => FileEntity) 
	@JoinColumn({ name: "profilePicId" }) 
	profilePic: FileEntity;

	@OneToOne(() => FileEntity) 
	@JoinColumn({ name: "coverPhotoId" }) 
	coverPhoto: FileEntity;

	@ManyToMany(() => FileEntity)
	@JoinTable({
		name: "user_photos", // table name for the junction table of this relation
		joinColumn: {
			name: "userId",
			referencedColumnName: "id"
		},
		inverseJoinColumn: {
			name: "photoId",
			referencedColumnName: "id"
		}
	})
	photos: FileEntity[];

	@OneToMany(() => PostEntity, post => post.owner, { cascade: true }) 
	@JoinColumn({ referencedColumnName: "ownerId" }) 
	posts: PostEntity[];	

	@OneToMany(() => PostCommentEntity, comment => comment.commenter, { cascade: true }) 
	@JoinColumn({ referencedColumnName: "commenterId" }) 
	comments: PostCommentEntity[];	

	@ManyToOne(() => RoleEntity, role => role.users) 
	role: RoleEntity; 

	@OneToMany(() => StoreEntity, store => store.owner, { cascade: true }) 
	@JoinColumn({ referencedColumnName: "ownerId" }) 
	stores: StoreEntity[];	

	@OneToMany(() => OrderEntity, order => order.user, { cascade: true }) 
	@JoinColumn({ referencedColumnName: "userId" }) 
	orders: OrderEntity[];

}
