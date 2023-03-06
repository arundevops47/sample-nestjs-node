import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto, OrderPaginator } from './dto/get-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import Fuse from 'fuse.js';
import ordersJson from '@db/orders.json';
import orderStatusJson from '@db/order-statuses.json';
import { plainToClass } from 'class-transformer';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderStatus } from './entities/order-status.entity';
import { paginate } from 'src/common/pagination/paginate';
import {
  GetOrderStatusesDto,
  OrderStatusPaginator,
} from './dto/get-order-statuses.dto';
import {
  CheckoutVerificationDto,
  VerifiedCheckoutData,
} from './dto/verify-checkout.dto';
import {
  CreateOrderStatusDto,
  UpdateOrderStatusDto,
} from './dto/create-order-status.dto';

const options = {
  keys: ['name', 'type.slug'],
  threshold: 0.3,
};

@Injectable()
export class OrdersService {
  private orders: OrderEntity[];
  private orderStatus: OrderStatus[];

	constructor(
    @InjectRepository(OrderEntity)
    private orderRepo: Repository<OrderEntity>,							 
	) {
	}

  create(createOrderInput: CreateOrderDto) {
    return this.orders[0];
  }

  async getOrders({
    limit,
    page,
    trackingNumber,
    search,
    storeId,
    customer_id,
  }: GetOrdersDto): Promise<OrderPaginator> {

    if (!page) page = 1;


		this.orders = await this.orderRepo
										.createQueryBuilder('orders')
										.getMany();


		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		let data: OrderEntity[] = this.orders;

    if (storeId && storeId !== 'undefined') {
      data = this.orders?.filter((p) => p?.store?.id === Number(storeId));
    }
		
    const results = data.slice(startIndex, endIndex);
    const url = `/orders?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };

  }

  getOrderById(id: number): OrderEntity {
    return this.orders.find((p) => p.id === Number(id));
  }

  getOrderByTrackingNumber(trackingNumber: string): OrderEntity {
    const parentOrder = this.orders.find(
      (p) => p.trackingNumber === trackingNumber,
    );
    if (!parentOrder) {
      return this.orders[0];
    }
    return parentOrder;
  }

  getOrderStatuses({
    limit,
    page,
    search,
    orderBy,
  }: GetOrderStatusesDto): OrderStatusPaginator {
    if (!page || page.toString() === 'undefined') page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data: OrderStatus[] = this.orderStatus;

    // if (storeId) {
    //   data = this.orders?.filter((p) => p?.store?.id === storeId);
    // }
    const results = data.slice(startIndex, endIndex);
    const url = `/order-status?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getOrderStatus(slug: string) {
    return this.orderStatus.find((p) => p.name === slug);
  }

  update(id: number, updateOrderInput: UpdateOrderDto) {
    return this.orders[0];
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  verifyCheckout(input: CheckoutVerificationDto): VerifiedCheckoutData {
    return {
      total_tax: 0,
      shipping_charge: 0,
      unavailable_products: [],
      wallet_currency: 0,
      wallet_amount: 0,
    };
  }

  createOrderStatus(createOrderStatusInput: CreateOrderStatusDto) {
    return this.orderStatus[0];
  }

  updateOrderStatus(updateOrderStatusInput: UpdateOrderStatusDto) {
    return this.orderStatus[0];
  }
}
