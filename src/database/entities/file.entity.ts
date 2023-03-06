import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
enum AccessType {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ nullable: true })
  public key: string;
	
	@Column()
  public name: string;
 
	@Column({ nullable: true })
  public size: number;
 
	@Column({ nullable: true })
  public mimeType: string;

  @Column()
  public url: string;
		
	@Column({ nullable: true })
  public thumbnail: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
	
	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt: Date;
}
 