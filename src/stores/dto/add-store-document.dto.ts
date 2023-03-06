import { PickType } from '@nestjs/swagger';
import { StoreDocument } from '../entities/store-documents.entity';

export class AddStoreDocumentDto extends PickType(StoreDocument, [
	'identity',
  'business',
  'address',
  'others',
]) {

}

export class ChangeStoreDocumentStatusDto {
  id: number;
  status: string;
}
