import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

export class StoreDocument {
  identity: Attachment;
  business: Attachment;
  address?: Attachment;
	others?: Attachment;
}
