import { PickType } from '@nestjs/swagger';
import { StoreEntity } from 'src/database/entities/store.entity';

export class CreateStoreDto extends PickType(StoreEntity, [
	'storeCategory',
	'tags',
  'logo',
  'coverImage',
  'name',
  'description',
  'address',
  'settings',
	'socials',
	// 'docs',
  // 'balance',
]) {
	logo: any;
	coverImage: any;
	socials: any;
}

export class ApproveStoreDto {
  id: number;
  adminCommissioRate: number;
}
