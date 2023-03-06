import { OmitType } from '@nestjs/swagger';
import { ProductEntity } from 'src/database/entities/product.entity';

export class CreateProductDto extends OmitType(ProductEntity, [
  'id',
  'slug',
  'store',
  'orders',
  'tags',
  'categories',
  'group',
	'variations',
  'variationOptions',
  'createdAt',
  'updatedAt',
]) {
  tags: number[];
	categories: number[];
	variations: any;
	variationOptions: any;
}
