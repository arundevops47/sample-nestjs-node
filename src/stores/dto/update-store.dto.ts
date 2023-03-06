import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}

export class ApproveStoreDto {
  id: number;
  status: string;
}
