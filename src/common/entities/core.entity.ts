import { Type } from 'class-transformer';

export class CoreEntity {
  id: number;

  @Type(() => Date)
  createdAt: Date;
	
  @Type(() => Date)
  updatedAt: Date;
}
