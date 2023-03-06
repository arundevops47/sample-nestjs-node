import { PickType } from '@nestjs/swagger';
import { TagEntity } from 'src/database/entities/tag.entity';

export class CreateTagDto extends PickType(TagEntity, [
  'name',
  'icon',
  'details',
  'groupId',
	'group',
	'imageId',
	'image',
]) {}
