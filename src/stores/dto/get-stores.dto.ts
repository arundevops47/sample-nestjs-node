import { PaginationArgs } from 'src/common/dto/pagination-args.dto';

import { Paginator } from 'src/common/dto/paginator.dto';
import { StoreEntity } from 'src/database/entities/store.entity';
import { StoreDocumentEntity } from 'src/database/entities/store-document.entity';

export class StorePaginator extends Paginator<StoreEntity> {
  data: StoreEntity[];
}

export class GetStoresDto extends PaginationArgs {
  orderBy?: string;
  search?: string;
  sortedBy?: string;
  isActive?: boolean;
}


export class StoreDocumentDto {
	identity: StoreDocumentEntity[];
	business: StoreDocumentEntity[];
	address: StoreDocumentEntity[];
	others: StoreDocumentEntity[];
}

export class StoreDocumentPaginator extends Paginator<StoreDocumentEntity> {
  data: StoreDocumentEntity[];
}

export class GetStoresDocumentsDto extends PaginationArgs {
  orderBy?: string;
  search?: string;
  sortedBy?: string;
  isActive?: boolean;
}

export class StoreDocumentResponseDto {
	id: number;
	slug: string;
	documents: any
}



