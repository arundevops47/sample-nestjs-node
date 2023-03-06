import { PaginationArgs } from 'src/common/dto/pagination-args.dto';
import { Paginator } from 'src/common/dto/paginator.dto';

import { OrderEntity } from 'src/database/entities/order.entity';

export class OrderPaginator extends Paginator<OrderEntity> {
  data: OrderEntity[];
}

export class GetOrdersDto extends PaginationArgs {
  trackingNumber?: string;
  orderBy?: string;
  sortedBy?: string;
  customer_id?: number;
  storeId?: string;
  search?: string;
}
